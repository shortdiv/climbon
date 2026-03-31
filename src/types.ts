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
