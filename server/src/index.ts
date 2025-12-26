import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "crypto";
import { db } from "./firebase";
import type { Player, Room } from "./types";

const app = express();
app.use(cors({ origin: ["*", "http://localhost:5173"], credentials: true }));
app.use(express.json());

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

type RoomState = {
  room: Room;
  players: Map<string, Player>;
  sockets: Set<WebSocket>;
};

const rooms: Map<string, RoomState> = new Map();

function generateCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function formatDateTime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function send(ws: WebSocket, type: string, payload?: any) {
  console.log("[WS SEND]", { type, payload });
  ws.send(JSON.stringify({ type, payload }));
}

function broadcast(state: RoomState, type: string, payload?: any) {
  console.log("[WS BROADCAST]", {
    type,
    payload,
    recipients: state.sockets.size,
    room: state.room.code,
  });
  for (const s of state.sockets) {
    try {
      send(s, type, payload);
    } catch (e) {
      console.error("[WS BROADCAST ERROR]", e);
    }
  }
}

async function persistRoom(r: Room) {
  if (!db) return;
  await db.collection("rooms").doc(r.code).set(r);
}

async function persistPlayer(code: string, p: Player) {
  if (!db) return;
  await db.collection("rooms").doc(code).collection("players").doc(p.id).set(p);
}

async function removePlayer(code: string, id: string) {
  if (!db) return;
  await db.collection("rooms").doc(code).collection("players").doc(id).delete();
}

app.post("/api/rooms", async (req, res) => {
  const { name } = req.body || {};
  console.log(name);
  
  if (!name) return res.status(400).json({ error: "name_required" });
  const code = generateCode();
  const ownerId = randomUUID();
  const room: Room = {
    id: randomUUID(),
    code,
    name,
    ownerId,
    status: "open",
    createdAt: formatDateTime(new Date()),
  };
  const state: RoomState = {
    room,
    players: new Map(),
    sockets: new Set(),
  };
  rooms.set(code, state);
  await persistRoom(room);
  res.json({ code, name: room.name });
});

app.get("/api/rooms", async (req, res) => {
  if (db) {
    const snap = await db.collection("rooms").get();
    return res.json(snap.docs.map((d) => d.data()));
  }
  res.json([]);
});

app.get("/api/rooms/:code", async (req, res) => {
  const code = req.params.code;
  const state = rooms.get(code);
  if (state) {
    return res.json({
      name: state.room.name,
      code: state.room.code,
      status: state.room.status,
    });
  }
  if (db) {
    const snap = await db.collection("rooms").doc(code).get();
    if (snap.exists) return res.json(snap.data());
  }
  res.status(404).json({ error: "not_found" });
});

app.get("/api/rooms/:code/players", async (req, res) => {
  const code = req.params.code;
  const state = rooms.get(code);
  if (state) {
    return res.json(
      Array.from(state.players.values()).map((p) => ({
        username: p.username,
        id: p.id,
      }))
    );
  }
  if (db) {
    const snap = await db
      .collection("rooms")
      .doc(code)
      .collection("players")
      .get();
    return res.json(
      snap.docs.map((d) => ({
        username: d.data().username,
        id: d.data().id ?? d.id,
      }))
    );
  }
  res.json([]);
});

wss.on("connection", (ws) => {
  console.log("[WS CONNECTION] opened");
  let current: { code?: string; playerId?: string } = {};

  ws.on("message", async (msg) => {
    let data: any;
    try {
      data = JSON.parse(msg.toString());
    } catch {
      console.warn("[WS MESSAGE] invalid json", msg.toString());
      return;
    }
    console.log("[WS MESSAGE]", data);
    const { type, payload } = data || {};

    if (type === "create_room") {
      const code = generateCode();
      const ownerId = randomUUID();
      const room: Room = {
        id: randomUUID(),
        code,
        name: payload?.name || "Room",
        ownerId,
        status: "open",
        createdAt: formatDateTime(new Date()),
      };
      const state: RoomState = {
        room,
        players: new Map(),
        sockets: new Set([ws]),
      };
      rooms.set(code, state);
      const host: Player = {
        id: ownerId,
        username: "host",
        role: "host",
        connected: true,
        socketId: randomUUID(),
        joinedAt: Date.now(),
      };
      state.players.set(host.id, host);
      await persistRoom(room);
      await persistPlayer(code, host);
      current = { code, playerId: host.id };
      send(ws, "room_created", { code, name: room.name });
    }

    if (type === "subscribe_room") {
      const code: string = payload?.code;
      const state = rooms.get(code);
      if (!state) {
        console.warn("[SUBSCRIBE_ROOM] missing room", { code });
        send(ws, "error", { message: "room_missing" });
        return;
      }
      state.sockets.add(ws);
      current = { ...current, code };
      console.log("[SUBSCRIBE_ROOM] subscribed", { code });
      send(ws, "subscribed", { code });
    }

    if (type === "join_room") {
      const code: string = payload?.code;
      const username: string = payload?.username;
      const state = rooms.get(code);
      if (!state || state.room.status !== "open") {
        send(ws, "error", { message: "room_closed_or_missing" });
        return;
      }
      const player: Player = {
        id: randomUUID(),
        username,
        role: "player",
        connected: true,
        socketId: randomUUID(),
        joinedAt: Date.now(),
      };
      state.players.set(player.id, player);
      state.sockets.add(ws);
      await persistPlayer(code, player);
      current = { code, playerId: player.id };
      broadcast(state, "player_joined", { username, playerId: player.id });
      console.log("[PLAYER_JOINED]", { code, username, playerId: player.id });
      send(ws, "joined", { code, playerId: player.id });
    }

    if (type === "leave_room") {
      const code: string = payload?.code;
      const state = rooms.get(code);
      if (!state) return;
      const id: string = payload?.playerId;
      const player = state.players.get(id);
      if (player) {
        state.players.delete(id);
        await removePlayer(code, id);
        broadcast(state, "player_left", { username: player.username, playerId: id });
        console.log("[PLAYER_LEFT]", { code, username: player.username, id });
      }
    }

    if (type === "kick_player") {
      const code: string = payload?.code;
      const id: string = payload?.playerId;
      const state = rooms.get(code);
      if (!state) return;
      const player = state.players.get(id);
      if (player) {
        state.players.delete(id);
        await removePlayer(code, id);
        broadcast(state, "player_kicked", { username: player.username, playerId: id });
        console.log("[PLAYER_KICKED]", { code, username: player.username, id });
      }
    }

    if (type === "close_room") {
      const code: string = payload?.code;
      const state = rooms.get(code);
      if (!state) return;
      state.room.status = "closed";
      await persistRoom(state.room);
      broadcast(state, "room_closed", { code });
      console.log("[ROOM_CLOSED]", { code });
      rooms.delete(code);
    }
  });

  ws.on("close", async () => {
    console.log("[WS CONNECTION] closed");
    const code = current.code;
    const id = current.playerId;
    if (code && id) {
      const state = rooms.get(code);
      if (state) {
        const player = state.players.get(id);
        if (player) {
          state.players.delete(id);
          await removePlayer(code, id);
          broadcast(state, "player_left", { username: player.username });
        }
        state.sockets.delete(ws);
      }
    }
  });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
httpServer.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
