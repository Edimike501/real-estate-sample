"use client";

import { useCallback, useState } from "react";

import {
  clearGuestSession,
  getGuestSession,
  type GuestSession,
  setGuestSession,
} from "@/lib/session";

export function useGuestSession() {
  const [session, setSession] = useState<GuestSession | null>(() => getGuestSession());

  const saveSession = useCallback((data: Omit<GuestSession, "savedAt">) => {
    setGuestSession(data);
    setSession(getGuestSession());
  }, []);

  const clearSession = useCallback(() => {
    clearGuestSession();
    setSession(null);
  }, []);

  return {
    session,
    saveSession,
    clearSession,
  };
}
