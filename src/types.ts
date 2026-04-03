export interface Gym {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "bouldering" | "rope" | "both";
  hours: Record<string, string>;
  memberRates: { daily: number; monthly: number };
  website: string;
  neighborhood: string;
}

export interface ClimbingPartner {
  id: string;
  name: string;
  neighborhood: string;
  climbingType: "bouldering" | "rope" | "both";
  level: "beginner" | "intermediate" | "advanced";
  availability: string;
  bio: string;
  homeGym: string;
  contact?: string;
}
