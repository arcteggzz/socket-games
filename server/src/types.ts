export type RoomStatus = "open" | "closed";

export type Room = {
  id: string;
  code: string;
  name: string;
  ownerId: string;
  status: RoomStatus;
  createdAt: string;
};

export type Player = {
  id: string;
  username: string;
  role: "host" | "player";
  connected: boolean;
  socketId?: string;
  joinedAt: number;
};
