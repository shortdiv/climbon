import type { Gym } from "../types";
import { GymCard } from "./GymCard";
import "./GymList.css";

export function GymList({ gyms }: { gyms: Gym[] }) {
  if (gyms.length === 0) {
    return <p className="no-results">No gyms match your filters.</p>;
  }
  return (
    <div className="gym-grid">
      {gyms.map((gym) => (
        <GymCard key={gym.id} gym={gym} />
      ))}
    </div>
  );
}
