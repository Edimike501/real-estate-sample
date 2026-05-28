"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:border-accent transition-colors"
      aria-label="Toggle theme">
      <Sun className="w-5 h-5 text-text-primary dark:hidden rotate-0 transition-transform" />
      <Moon className="w-5 h-5 text-text-primary hidden dark:block rotate-180 transition-transform" />
    </button>
  );
}
