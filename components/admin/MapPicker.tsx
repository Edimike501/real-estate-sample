"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";

import "@/lib/leaflet-fix";
import { useDebounce } from "@/hooks/use-debounce.hooks";

type MapPickerProps = {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number, address: string) => void;
};

type MarkerControllerProps = {
  position: [number, number];
  onMove: (lat: number, lng: number) => void;
};

function MarkerController({ position, onMove }: MarkerControllerProps) {
  useMapEvents({
    click(event) {
      onMove(event.latlng.lat, event.latlng.lng);
    },
  });

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend(event) {
          const marker = event.target as L.Marker;
          const latlng = marker.getLatLng();
          onMove(latlng.lat, latlng.lng);
        },
      }}
    />
  );
}

export function MapPicker({ initialLat, initialLng, onLocationChange }: MapPickerProps) {
  const [coords, setCoords] = useState<[number, number]>([initialLat ?? 6.5244, initialLng ?? 3.3792]);
  const [isLocating, setIsLocating] = useState(false);
  const [address, setAddress] = useState("");
  const debouncedCoords = useDebounce(coords, 1100);
  const center = useMemo(() => coords, [coords]);

  useEffect(() => {
    const controller = new AbortController();

    async function reverseGeocode() {
      setIsLocating(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${debouncedCoords[0]}&lon=${debouncedCoords[1]}`,
          {
            headers: {
              "Accept-Language": "en",
            },
            signal: controller.signal,
          }
        );
        const data = (await response.json()) as { display_name?: string };
        const displayName = data.display_name ?? "";
        setAddress(displayName);
        onLocationChange(debouncedCoords[0], debouncedCoords[1], displayName);
      } catch {
        onLocationChange(debouncedCoords[0], debouncedCoords[1], "");
      } finally {
        setIsLocating(false);
      }
    }

    void reverseGeocode();

    return () => controller.abort();
  }, [debouncedCoords, onLocationChange]);

  return (
    <div className="space-y-2">
      <div className="h-[320px] overflow-hidden rounded-lg border border-border">
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerController position={coords} onMove={(lat, lng) => setCoords([lat, lng])} />
        </MapContainer>
      </div>
      <p className="text-xs text-text-muted">
        {isLocating ? "Locating..." : address || "Click or drag marker to set location"}
      </p>
    </div>
  );
}
