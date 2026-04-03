import type { ClimbingPartner } from "../types";
import { PartnerCard } from "./PartnerCard";
import "./PartnerList.css";

export function PartnerList({ partners }: { partners: ClimbingPartner[] }) {
  if (partners.length === 0) {
    return <p className="no-results">No partners found.</p>;
  }
  return (
    <div className="partner-grid">
      {partners.map((partner) => (
        <PartnerCard key={partner.id} partner={partner} />
      ))}
    </div>
  );
}
