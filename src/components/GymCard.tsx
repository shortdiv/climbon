import type { Gym } from "../types";
import "./GymCard.css";

const typeColors: Record<string, string> = {
  bouldering: "#e07b39",
  rope: "#3b82f6",
  both: "#8b5cf6",
};

export function GymCard({ gym }: { gym: Gym }) {
  return (
    <div className="gym-card">
      <div className="gym-card-header">
        <h3>{gym.name}</h3>
        <div className="badges">
          <span className="badge" style={{ backgroundColor: typeColors[gym.type] }}>
            {gym.type}
          </span>
          <span className="badge management-badge">
            {gym.management}
          </span>
        </div>
      </div>
      <p className="neighborhood">{gym.neighborhood}</p>
      <p className="address">{gym.address}</p>
      <div className="hours">
        {Object.entries(gym.hours).map(([days, time]) => (
          <div key={days}>
            <strong>{days}:</strong> {time}
          </div>
        ))}
      </div>
      <div className="rates">
        {gym.memberRates.daily > 0 ? (
          <>
            <span>Day pass: ${gym.memberRates.daily}</span>
            <span>Monthly: ${gym.memberRates.monthly}</span>
          </>
        ) : (
          <span>Free / Outdoor</span>
        )}
      </div>
      {gym.boards && gym.boards.length > 0 && (
        <div className="boards">
          <strong>Boards:</strong>
          <div className="boards-list">
            {gym.boards.map((board) => (
              <span key={board} className="board-badge">{board}</span>
            ))}
          </div>
        </div>
      )}
      <a
        href={gym.website}
        target="_blank"
        rel="noopener noreferrer"
        className="website-link"
        aria-label={`Visit ${gym.name} website`}
      >
        Visit website →
      </a>
    </div>
  );
}
