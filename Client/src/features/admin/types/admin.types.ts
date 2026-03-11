// ─────────────────────────────────────────────
//  ADMIN DASHBOARD TYPES
// ─────────────────────────────────────────────

export interface Application {
  id: number;
  name: string;
  email: string;
  company: string;
  role: "exhibitor" | "attendee";
  expo: string;
  appliedOn: string;
  status: "pending" | "approved" | "rejected";
}

export type ExpoDisplayStatus = "ongoing" | "completed" | "upcoming";

export type DashboardPage = "dashboard" | "expos" | "applications" | "create-expo" | "drafted-expos";
