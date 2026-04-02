import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Gym } from "../types";
import "./GymMap.css";

const typeColors: Record<string, string> = {
  bouldering: "#f59e0b",
  rope: "#38bdf8",
  both: "#a78bfa",
};

function createIcon(type: Gym["type"]) {
  const color = typeColors[type];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}"/>
    <circle cx="12" cy="12" r="5" fill="#fff"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "custom-marker",
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
}

export function GymMap({ gyms }: { gyms: Gym[] }) {
  return (
    <MapContainer
      center={[40.735, -73.965]}
      zoom={12}
      className="gym-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />
      {gyms.map((gym) => (
        <Marker key={gym.id} position={[gym.lat, gym.lng]} icon={createIcon(gym.type)}>
          <Popup>
            <strong>{gym.name}</strong>
            <br />
            <em>{gym.neighborhood}</em>
            <br />
            {gym.address}
            <br />
            {Object.entries(gym.hours).map(([days, time]) => (
              <span key={days}>
                {days}: {time}
                <br />
              </span>
            ))}
            {gym.memberRates.daily > 0 ? (
              <>Day pass: ${gym.memberRates.daily}</>
            ) : (
              <>Free / Outdoor</>
            )}
            <br />
            <a href={gym.website} target="_blank" rel="noreferrer">
              Website
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
