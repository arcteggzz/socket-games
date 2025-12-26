import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { getRoomByCode, waitingUrl } from "../../utils/api";
import useWebSocket from "react-use-websocket";
import routePaths from "../../utils/routePaths";

export default function JoinGame() {
  const [params] = useSearchParams();
  const code = useMemo(() => params.get("game-code") || "", [params]);
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_SERVER_URL || "ws://localhost:3001";

  const [username, setUsername] = useState("");
  const [userCode, setUserCode] = useState("");
  const [room, setRoom] = useState<{ name: string } | null>(null);

  const { sendJsonMessage } = useWebSocket(serverUrl.replace("http", "ws"), {
    share: true,
    filter: () => true,
  });

  function join() {
    if (!username) return;
    if (!code && !userCode) return;
    
    if (code) {
      sendJsonMessage({ type: "join_room", payload: { code: code, username } });
      navigate(waitingUrl(code));
    }
    if (userCode) {
      sendJsonMessage({ type: "join_room", payload: { code: userCode, username } });
      navigate(waitingUrl(userCode));
    }
  }

  useEffect(() => {
    if (code) {
      getRoomByCode(code).then((r) => setRoom(r));
    }
  }, [code]);

  return (
    <div className="grid gap-4">
      <div className="text-xl font-semibold">Join Game</div>

      {!code && (
        <input
          placeholder="Game code"
          className="w-full border border-neutral-300 dark:border-neutral-700 rounded-md px-3 py-2 bg-white dark:bg-neutral-900"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
        />
      )}

      <input
        placeholder="Username"
        className="w-full border border-neutral-300 dark:border-neutral-700 rounded-md px-3 py-2 bg-white dark:bg-neutral-900"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Button onClick={join}>Join</Button>
      <Button onClick={() => navigate(routePaths.root)} variant="ghost">
        Back
      </Button>

      {room && <div className="text-sm">Room: {room.name}</div>}
    </div>
  );
}
