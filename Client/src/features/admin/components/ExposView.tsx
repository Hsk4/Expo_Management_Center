// ─────────────────────────────────────────────
//  EXPOS VIEW PAGE
// ─────────────────────────────────────────────

import { Icon } from "./Icons";
import { type ExpoData } from "../../../services/expo.service";
import { getExpoStatus, formatDate } from "../utils/expoHelpers";

interface ExposViewProps {
  expos: ExpoData[];
}

export function ExposView({ expos }: ExposViewProps) {
  const exposWithStatus = expos.map(expo => ({
    ...expo,
    displayStatus: getExpoStatus(expo)
  }));

  const ongoingCount   = exposWithStatus.filter(e => e.displayStatus === "ongoing").length;
  const completedCount = exposWithStatus.filter(e => e.displayStatus === "completed").length;
  const upcomingCount  = exposWithStatus.filter(e => e.displayStatus === "upcoming").length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">All Expos</h1>
        <p className="page-subtitle">Browse every expo registered on the platform.</p>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <span className="badge badge-ongoing">{ongoingCount} Ongoing</span>
        <span className="badge badge-completed">{completedCount} Completed</span>
        <span className="badge badge-upcoming">{upcomingCount} Upcoming</span>
      </div>

      <div className="glass-panel">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Expo Name</th>
                <th>Theme</th>
                <th>Status</th>
                <th>Date</th>
                <th>Location</th>
                <th>Attendees</th>
                <th>Exhibitors</th>
              </tr>
            </thead>
            <tbody>
              {exposWithStatus.length > 0 ? (
                exposWithStatus.map(expo => (
                  <tr key={expo._id}>
                    <td><span className="cell-strong">{expo.title}</span></td>
                    <td><span className="cell-dim">{expo.theme || "—"}</span></td>
                    <td><span className={`badge badge-${expo.displayStatus}`}>{expo.displayStatus}</span></td>
                    <td><span className="cell-date"><Icon.Calendar /> {formatDate(expo.startDate)}</span></td>
                    <td><span className="cell-dim">{expo.location}</span></td>
                    <td><span className="cell-number">{expo.attendeesRegisteredCount > 0 ? expo.attendeesRegisteredCount.toLocaleString() : "—"}</span></td>
                    <td><span className="cell-number">{expo.boothsBookedCount > 0 ? expo.boothsBookedCount.toLocaleString() : "—"}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--text-dim)" }}>
                    No expos found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

