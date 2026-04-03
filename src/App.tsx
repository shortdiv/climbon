import { useState, useMemo } from "react";
import gymsData from "./data/gyms.json";
import partnersData from "./data/partners.json";
import type { Gym, ClimbingPartner } from "./types";
import { FilterBar } from "./components/FilterBar";
import { GymMap } from "./components/GymMap";
import { GymList } from "./components/GymList";
import { PartnerList } from "./components/PartnerList";
import { Footer } from "./components/Footer";
import "./App.css";

type GymType = Gym["type"] | "all";

const gyms: Gym[] = gymsData as Gym[];
const partners: ClimbingPartner[] = partnersData as ClimbingPartner[];

function App() {
  const [view, setView] = useState<"map" | "list" | "partners">("map");
  const [typeFilter, setTypeFilter] = useState<GymType>("all");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("");

  const neighborhoods = useMemo(
    () => [...new Set(gyms.map((g) => g.neighborhood))].sort(),
    []
  );

  const filtered = useMemo(
    () =>
      gyms.filter((g) => {
        if (typeFilter !== "all" && g.type !== typeFilter) return false;
        if (neighborhoodFilter && g.neighborhood !== neighborhoodFilter)
          return false;
        return true;
      }),
    [typeFilter, neighborhoodFilter]
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <h1>ClimbOn</h1>
          <p className="subtitle">NYC Climbing Gym Finder</p>
        </div>
        <nav className="header-nav">
          <span className="gym-count">{gyms.length} gyms across NYC</span>
        </nav>
      </header>
      {view !== "partners" && (
        <FilterBar
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          neighborhoodFilter={neighborhoodFilter}
          onNeighborhoodChange={setNeighborhoodFilter}
          neighborhoods={neighborhoods}
        />
      )}
      <div className="view-toggle">
        <button
          className={view === "map" ? "active" : ""}
          onClick={() => setView("map")}
        >
          Map
        </button>
        <button
          className={view === "list" ? "active" : ""}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={view === "partners" ? "active" : ""}
          onClick={() => setView("partners")}
        >
          Partners
        </button>
        {view !== "partners" && <span className="count">{filtered.length} gyms</span>}
      </div>
      {view === "map" && <GymMap gyms={filtered} />}
      {view === "list" && <GymList gyms={filtered} />}
      {view === "partners" && <PartnerList partners={partners} />}
      <Footer />
    </div>
  );
}

export default App;
