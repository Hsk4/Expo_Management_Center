// ─────────────────────────────────────────────
//  MOCK DATA FOR APPLICATIONS
//
//  TODO: Replace with real API calls when application
//  endpoints are implemented
// ─────────────────────────────────────────────

import { type Application } from "../types/admin.types";

export const applications: Application[] = [
  { id: 1, name: "Raza Ahmed",      email: "raza@techco.pk",      company: "TechCo Pakistan", role: "exhibitor", expo: "TechWorld Summit 2025", appliedOn: "Feb 20, 2025", status: "pending"  },
  { id: 2, name: "Sara Khan",        email: "sara.k@gmail.com",    company: "",                role: "attendee",  expo: "TechWorld Summit 2025", appliedOn: "Feb 21, 2025", status: "approved" },
  { id: 3, name: "Innovatech Ltd",   email: "info@innovatech.com", company: "Innovatech Ltd",  role: "exhibitor", expo: "BuildCon Expo 2025",    appliedOn: "Feb 22, 2025", status: "pending"  },
  { id: 4, name: "Ali Mirza",        email: "ali.m@mail.com",      company: "",                role: "attendee",  expo: "BuildCon Expo 2025",    appliedOn: "Feb 23, 2025", status: "rejected" },
  { id: 5, name: "FutureBuild Co.", email: "fb@future.io",         company: "FutureBuild Co.", role: "exhibitor", expo: "GreenFuture 2025",      appliedOn: "Feb 25, 2025", status: "pending"  },
  { id: 6, name: "Zara Noor",        email: "zara.n@uni.edu.pk",   company: "",                role: "attendee",  expo: "GreenFuture 2025",      appliedOn: "Feb 26, 2025", status: "approved" },
];

