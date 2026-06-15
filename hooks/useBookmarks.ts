"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "opollo_bookmarks";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface BookmarkData {
  ids: string[];
  savedAt: number;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load bookmarks on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsed: BookmarkData = JSON.parse(item);
        const now = Date.now();
        // Check TTL
        if (now - parsed.savedAt > TTL_MS) {
          window.localStorage.removeItem(STORAGE_KEY);
          setBookmarks([]);
        } else {
          setBookmarks(parsed.ids);
        }
      }
    } catch (error) {
      console.error("Error reading bookmarks from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  const saveBookmarks = useCallback((newIds: string[]) => {
    if (typeof window === "undefined") return;

    try {
      const data: BookmarkData = {
        ids: newIds,
        savedAt: Date.now(),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setBookmarks(newIds);
    } catch (error) {
      console.error("Error writing bookmarks to localStorage", error);
    }
  }, []);

  const isBookmarked = useCallback(
    (id: string): boolean => {
      return bookmarks.includes(id);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      if (!isInitialized) return;
      const nextBookmarks = bookmarks.includes(id)
        ? bookmarks.filter((bId) => bId !== id)
        : [...bookmarks, id];
      saveBookmarks(nextBookmarks);
    },
    [bookmarks, saveBookmarks, isInitialized]
  );

  const clearBookmarks = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setBookmarks([]);
    } catch (error) {
      console.error("Error clearing bookmarks", error);
    }
  }, []);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    clearBookmarks,
    count: bookmarks.length,
    isInitialized,
  };
}
