import { useState } from "react";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import useWebSocket from "react-use-websocket";
import { joinUrl, masterUrl } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import routePaths from "../../utils/routePaths";

type ServerMessage = {
  type: string;
  payload?: unknown;
};

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [openQR, setOpenQR] = useState(false);
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_SERVER_URL || "ws://localhost:3001";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket<ServerMessage>(
    serverUrl.replace("http", "ws"),
    {
      share: true,
      filter: () => true,
    }
  );

  function createRoom() {
    if (!roomName) return;
    sendJsonMessage({ type: "create_room", payload: { name: roomName } });
  }

  if (
    lastJsonMessage &&
    lastJsonMessage.type === "room_created" &&
    lastJsonMessage.payload
  ) {
    const { code } = lastJsonMessage.payload as { code: string };
    if (!roomCode) setRoomCode(code);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-semibold">Create Room</div>
      <input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room name"
        className="w-full border border-neutral-300 dark:border-neutral-700 rounded-md px-3 py-2 bg-white dark:bg-neutral-900"
      />

      <div className="flex justify-center items-center space-x-4">
        <Button onClick={() => navigate(routePaths.root)} variant="ghost">
          Cancel
        </Button>
        <Button onClick={createRoom}>Create</Button>
      </div>

      {roomCode && (
        <div className="grid gap-3">
          <div className="text-sm">Code: {roomCode}</div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(roomCode)}
            >
              Copy Code
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(joinUrl(roomCode))}
            >
              Copy Link
            </Button>
            <Button variant="ghost" onClick={() => setOpenQR(true)}>
              Show QR
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(masterUrl(roomCode))}
            >
              Go To Master
            </Button>
          </div>
        </div>
      )}

      <Modal open={openQR} onClose={() => setOpenQR(false)} title="Join QR">
        <div className="grid place-items-center">
          <QRCode value={joinUrl(roomCode)} />
        </div>
      </Modal>
    </div>
  );
}
