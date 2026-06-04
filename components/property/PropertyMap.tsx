"use client";

import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import "@/lib/leaflet-fix";

type PropertyMapProps = {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  landmark: string | null;
  propertyTitle: string;
};

export function PropertyMap({
  latitude,
  longitude,
  address,
  landmark,
  propertyTitle
}: PropertyMapProps) {
  const location = useMemo(() => {
    if (latitude === null || longitude === null) return null;
    return [latitude, longitude] as [number, number];
  }, [latitude, longitude]);

  if (!location) {
    return (
      <div className="rounded-lg border border-border bg-bg-secondary p-4 text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">Location details</p>
        {address && <p className="text-sm">{address}</p>}
        {landmark && <p className="text-sm text-text-muted">{landmark}</p>}
        {!address && !landmark && (
          <p>Location details unavailable for this listing.</p>
        )}
      </div>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location[0]},${location[1]}`;

  return (
    <section className="space-y-3 rounded-lg border border-border bg-bg-secondary p-3">
      <div className="h-[320px] overflow-hidden rounded-lg">
        <MapContainer
          center={location}
          zoom={15}
          style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={location}>
            <Popup>{propertyTitle}</Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="space-y-2">
        {address && (
          <p className="text-sm font-semibold text-text-primary">{address}</p>
        )}
        {landmark && <p className="text-sm text-text-secondary">{landmark}</p>}
      </div>
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-light">
        Get Directions
      </a>
    </section>
  );
}
