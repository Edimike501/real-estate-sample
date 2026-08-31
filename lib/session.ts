const SESSION_KEY = "aura_guest";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type GuestSession = {
  name: string;
  phone: string;
  email?: string;
  savedAt: number;
};

export function getGuestSession(): GuestSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as GuestSession;
    if (Date.now() - parsed.savedAt > TTL_MS) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function setGuestSession(data: Omit<GuestSession, "savedAt">): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      ...data,
      savedAt: Date.now(),
    })
  );
}

export function clearGuestSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
