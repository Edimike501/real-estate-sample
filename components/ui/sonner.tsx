"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-bg-secondary group-[.toaster]:text-text-primary group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-md p-4 flex gap-3 w-full border text-sm",
          description: "group-[.toast]:text-text-muted text-xs leading-relaxed",
          actionButton:
            "group-[.toast]:bg-accent group-[.toast]:text-white font-medium px-3 py-1.5 rounded-md hover:opacity-90 transition cursor-pointer text-xs",
          cancelButton:
            "group-[.toast]:bg-bg-primary group-[.toast]:text-text-secondary group-[.toast]:border-border border font-medium px-3 py-1.5 rounded-md hover:bg-bg-tertiary transition cursor-pointer text-xs",
        },
      }}
      {...props}
    />
  );
}
