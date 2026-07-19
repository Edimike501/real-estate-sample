"use client";

import { useEffect, useRef, useState } from "react";

import { BackButton } from "@/components/ui/BackButton";

export function PropertyDetailBackNav() {
  const topButtonRef = useRef<HTMLDivElement>(null);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const element = topButtonRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloating(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={topButtonRef} className="mb-4 w-full sm:w-auto">
        <BackButton
          href="/properties"
          label="Back to Properties"
          variant="default"
          className="w-full sm:w-auto"
        />
      </div>
      {showFloating && (
        <BackButton href="/properties" label="Back" variant="floating" />
      )}
    </>
  );
}
