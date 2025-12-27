import routePaths from "./routePaths";

const baseUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

export async function getRoomByCode(code: string) {
  const res = await fetch(`${baseUrl}/api/rooms/${code}`);
  if (!res.ok) return null;
  return res.json();
}

export type PlayerSummary = { username: string; id: string };

export async function getPlayersByCode(code: string): Promise<PlayerSummary[]> {
  const res = await fetch(`${baseUrl}/api/rooms/${code}/players`);
  if (!res.ok) return [];
  return res.json();
}

export function joinUrl(code: string) {
  return `${window.location.origin}${
    routePaths.join
  }?game-code=${encodeURIComponent(code)}`;
}

export function masterUrl(code: string) {
  return `${window.location.origin}${
    routePaths.master
  }?game-code=${encodeURIComponent(code)}`;
}

export function waitingUrl(code: string) {
  return `${window.location.origin}${
    routePaths.waiting
  }?game-code=${encodeURIComponent(code)}`;
}

export async function getHealth(): Promise<string> {
  const res = await fetch(`${baseUrl}/api/health`);
  if (!res.ok) throw new Error("health_unavailable");
  return res.json();
}
