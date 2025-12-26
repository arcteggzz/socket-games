import Button from "../../components/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import routePaths from "../../utils/routePaths";
import { useMemo, useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { getPlayersByCode, type PlayerSummary } from "../../utils/api";
type ServerMessage = { type: string; payload?: unknown };

export default function Waiting() {
  const [params] = useSearchParams();
  const code = useMemo(() => params.get("game-code") || "", [params]);
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_SERVER_URL || "ws://localhost:3001";

  const [players, setPlayers] = useState<Array<PlayerSummary>>([]);

  const { sendJsonMessage } = useWebSocket<ServerMessage>(
    serverUrl.replace("http", "ws"),
    {
      share: true,
      filter: () => true,
      onOpen: () => {
        if (code) {
          sendJsonMessage({ type: "subscribe_room", payload: { code } });
        }
      },
      onMessage: (event) => {
        const data = JSON.parse(event.data as string) as ServerMessage;
        if (data.type === "player_joined" && data.payload) {
          const { username, playerId } = data.payload as {
            username: string;
            playerId: string;
          };
          if (playerId) {
            sessionStorage.setItem("playerId", playerId);
          }
          setPlayers((prev) =>
            prev.some((p) => p.id === playerId)
              ? prev
              : [...prev, { username, id: playerId }]
          );
        }
        if (data.type === "player_left" && data.payload) {
          const { playerId } = data.payload as {
            username: string;
            playerId: string;
          };
          setPlayers((prev) => prev.filter((p) => p.id !== playerId));
        }
        if (data.type === "player_kicked" && data.payload) {
          const currentPlayerId = sessionStorage.getItem("playerId") || "";
          const { playerId } = data.payload as {
            username: string;
            playerId: string;
          };
          if (playerId === currentPlayerId) {
            navigate(routePaths.root);
          }
          setPlayers((prev) => prev.filter((p) => p.id !== playerId));
        }
        if (data.type === "joined" && data.payload) {
          const { playerId } = data.payload as {
            code: string;
            playerId: string;
          };
          if (playerId) {
            sessionStorage.setItem("playerId", playerId);
          }
        }
      },
    }
  );

  function leave() {
    const playerId = sessionStorage.getItem("playerId") || "";
    if (!playerId || !code) return;
    sendJsonMessage({ type: "leave_room", payload: { code, playerId } });
    navigate(routePaths.root);
  }

  useEffect(() => {
    if (code) {
      getPlayersByCode(code).then((list) => setPlayers(list));
    }
  }, [code]);

  return (
    <div className="grid gap-4 text-center">
      <div className="text-xl font-semibold">Waiting Room</div>
      <div className="text-sm">Waiting for the master to start a game</div>

      <div className="grid place-items-center">
        <div className="animate-pulse w-10 h-10 rounded-full bg-primary" />
      </div>

      <Button variant="ghost" onClick={leave}>
        Leave Room
      </Button>

      <div className="text-lg font-medium">Players in room</div>

      <div className="rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-100 dark:bg-neutral-800">
            <tr>
              <th className="text-center p-3">Username</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr
                key={p.username}
                className="border-t border-neutral-200 dark:border-neutral-800"
              >
                <td className="p-3">{p.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
