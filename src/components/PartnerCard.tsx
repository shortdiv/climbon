import type { ClimbingPartner } from "../types";
import "./PartnerCard.css";

const typeColors: Record<string, string> = {
  bouldering: "#e07b39",
  rope: "#3b82f6",
  both: "#8b5cf6",
};

const levelColors: Record<string, string> = {
  beginner: "#22c55e",
  intermediate: "#eab308",
  advanced: "#ef4444",
};

export function PartnerCard({ partner }: { partner: ClimbingPartner }) {
  return (
    <div className="partner-card">
      <div className="partner-card-header">
        <h3>{partner.name}</h3>
        <div className="partner-badges">
          <span className="badge" style={{ backgroundColor: typeColors[partner.climbingType] }}>
            {partner.climbingType}
          </span>
          <span className="badge" style={{ backgroundColor: levelColors[partner.level] }}>
            {partner.level}
          </span>
        </div>
      </div>
      <p className="neighborhood">{partner.neighborhood}</p>
      <p className="partner-gym">🏠 {partner.homeGym}</p>
      <p className="partner-availability">🕐 {partner.availability}</p>
      {partner.bio && <p className="partner-bio">{partner.bio}</p>}
    </div>
  );
}
