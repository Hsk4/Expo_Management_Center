// ─────────────────────────────────────────────
//  EXPO HELPER FUNCTIONS
// ─────────────────────────────────────────────

import { type ExpoData } from "../../../services/expo.service";
import { type ExpoDisplayStatus } from "../types/admin.types";

// Helper function to determine expo status based on dates
export const getExpoStatus = (expo: ExpoData): ExpoDisplayStatus => {
  const now = new Date();
  const start = new Date(expo.startDate);
  const end = new Date(expo.endDate);

  if (expo.status === "completed") return "completed";
  if (now >= start && now <= end) return "ongoing";
  if (now > end) return "completed";
  return "upcoming";
};

// Helper to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

