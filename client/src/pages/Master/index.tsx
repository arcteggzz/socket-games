import { useEffect, useMemo, useState } from "react";
import { getPlayersByCode, type PlayerSummary } from "../../utils/api";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import QRCode from "react-qr-code";
import { joinUrl } from "../../utils/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import routePaths from "../../utils/routePaths";
type ServerMessage = { type: string; payload?: unknown };

export default function Master() {
  const [params] = useSearchParams();
  const code = useMemo(() => params.get("game-code") || "", [params]);
  const [players, setPlayers] = useState<Array<PlayerSummary>>([]);
  const [openQR, setOpenQR] = useState(false);
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_SERVER_URL || "ws://localhost:3001";
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
          setPlayers((prev) =>
            prev.some((p) => p.id === playerId)
              ? prev
              : [...prev, { username, id: playerId }]
          );
        }
        if (
          (data.type === "player_left" || data.type === "player_kicked") &&
          data.payload
        ) {
          const { playerId } = data.payload as {
            username: string;
            playerId: string;
          };
          setPlayers((prev) => prev.filter((p) => p.id !== playerId));
        }
      },
    }
  );

  function kickPlayer(playerId: string, code: string) {
    if (!playerId || !code) return;
    sendJsonMessage({ type: "kick_player", payload: { code, playerId } });
  }

  useEffect(() => {
    if (code) {
      getPlayersByCode(code).then((list) => setPlayers(list));
    }
  }, [code]);

  return (
    <div className="grid gap-4">
      <div className="text-xl font-semibold flex justify-between items-center">
        <div>Games Master</div>
        <Button variant="ghost" onClick={() => navigate(routePaths.root)}>
          Home
        </Button>
      </div>

      {/* Room details */}
      <div className="rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-800 p-4 space-y-2">
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          Room Code
        </div>
        <div className="text-2xl font-bold tracking-widest uppercase">
          {code}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => navigator.clipboard.writeText(code as string)}
        >
          Copy Code
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigator.clipboard.writeText(joinUrl(code as string))}
        >
          Copy Link
        </Button>
        <Button variant="ghost" onClick={() => setOpenQR(true)}>
          Show QR
        </Button>
      </div>

      <div className="text-lg font-medium">Connected Players</div>

      <div className="rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-100 dark:bg-neutral-800">
            <tr>
              <th className="text-left p-3">Username</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr
                key={p.id}
                className="border-t border-neutral-200 dark:border-neutral-800"
              >
                <td className="p-3">{p.username}</td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    onClick={() => kickPlayer(p.id, code)}
                  >
                    Kick
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-lg font-medium">Select Room Game</div>

      <div className="rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-800 p-3">
        coming soon
      </div>

      <Modal open={openQR} onClose={() => setOpenQR(false)} title="Join QR">
        <div className="grid place-items-center">
          <QRCode value={joinUrl(code as string)} />
        </div>
      </Modal>
    </div>
  );
}
