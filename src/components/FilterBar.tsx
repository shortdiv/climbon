import type { Gym } from "../types";
import "./FilterBar.css";

type GymType = Gym["type"] | "all";

interface FilterBarProps {
  typeFilter: GymType;
  onTypeChange: (t: GymType) => void;
  neighborhoodFilter: string;
  onNeighborhoodChange: (n: string) => void;
  neighborhoods: string[];
  managementFilter: string;
  onManagementChange: (m: string) => void;
  managementCompanies: string[];
}

export function FilterBar({
  typeFilter,
  onTypeChange,
  neighborhoodFilter,
  onNeighborhoodChange,
  neighborhoods,
  managementFilter,
  onManagementChange,
  managementCompanies,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Type</label>
        <div className="type-buttons">
          {(["all", "bouldering", "rope", "both"] as GymType[]).map((t) => (
            <button
              key={t}
              className={typeFilter === t ? "active" : ""}
              onClick={() => onTypeChange(t)}
            >
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <label>Neighborhood</label>
        <select
          value={neighborhoodFilter}
          onChange={(e) => onNeighborhoodChange(e.target.value)}
        >
          <option value="">All neighborhoods</option>
          {neighborhoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Management</label>
        <select
          value={managementFilter}
          onChange={(e) => onManagementChange(e.target.value)}
        >
          <option value="">All management</option>
          {managementCompanies.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
