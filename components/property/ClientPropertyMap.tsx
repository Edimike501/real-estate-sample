// components/property/ClientPropertyMap.tsx
"use client"; // This is the crucial directive!

import dynamic from "next/dynamic";

// The dynamic loader lives safely inside a Client Component
const LeafletMap = dynamic(() => import("@/components/property/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="h-80 w-full bg-slate-100 animate-pulse rounded-lg" />
  )
});

// Export this wrapper to use in your Server Component
export default function ClientPropertyMap(
  props: React.ComponentProps<typeof LeafletMap>
) {
  return <LeafletMap {...props} />;
}
