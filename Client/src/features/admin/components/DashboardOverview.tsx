// ─────────────────────────────────────────────
//  DASHBOARD OVERVIEW PAGE
// ─────────────────────────────────────────────

import { Icon } from "./Icons";
import { type BoothApplicationData, type ExpoData } from "../../../services/expo.service";
import { getExpoStatus } from "../utils/expoHelpers";

interface DashboardOverviewProps {
  expos: ExpoData[];
  applications: BoothApplicationData[];
  onApproveApplication?: (applicationId: string) => Promise<void>;
  onRejectApplication?: (applicationId: string) => Promise<void>;
  busyApplicationId?: string | null;
}

export function DashboardOverview({
  expos,
  applications,
  onApproveApplication,
  onRejectApplication,
  busyApplicationId = null,
}: DashboardOverviewProps) {
  // Calculate statistics
  const exposWithStatus = expos.map(expo => ({
    ...expo,
    displayStatus: getExpoStatus(expo)
  }));

  const ongoingCount = exposWithStatus.filter(e => e.displayStatus === "ongoing").length;
  const completedCount = exposWithStatus.filter(e => e.displayStatus === "completed").length;
  const totalAttendees = expos.reduce((total, e) => total + e.attendeesRegisteredCount, 0);
  const totalExhibitors = expos.reduce((total, e) => total + e.boothsBookedCount, 0);
  const pendingApplications = applications.filter((a) => a.status === "pending");

  // Calculate max values for chart scaling
  const exposWithData = expos.filter(e => e.attendeesRegisteredCount > 0 || e.boothsBookedCount > 0);
  const maxAttendees = Math.max(...exposWithData.map(e => e.attendeesRegisteredCount), 1);
  const maxExhibitors = Math.max(...exposWithData.map(e => e.boothsBookedCount), 1);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Control Centre</h1>
        <p className="page-subtitle">Everything happening across EventSphere — live.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Ongoing Expos</span>
            <div className="stat-icon-box"><Icon.Expos /></div>
          </div>
          <div className="stat-number">{ongoingCount}</div>
          <div className="stat-trend"><Icon.TrendUp /> Live right now</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Completed Expos</span>
            <div className="stat-icon-box"><Icon.Dashboard /></div>
          </div>
          <div className="stat-number">{completedCount}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Total Attendees</span>
            <div className="stat-icon-box"><Icon.Users /></div>
          </div>
          <div className="stat-number">{totalAttendees.toLocaleString()}</div>
          <div className="stat-trend"><Icon.TrendUp /> Across all expos</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Total Exhibitors</span>
            <div className="stat-icon-box"><Icon.Applications /></div>
          </div>
          <div className="stat-number">{totalExhibitors.toLocaleString()}</div>
        </div>
      </div>

      {/* ── Bar Charts ── */}
      <div className="two-col">
        <div className="glass-panel">
          <p className="panel-label">Attendees per Expo</p>
          <div className="bar-chart">
            {exposWithData.length > 0 ? (
              exposWithData.slice(0, 6).map(expo => (
                <div key={expo._id} className="bar-col">
                  <span className="bar-top-label">{expo.attendeesRegisteredCount.toLocaleString()}</span>
                  <div className="bar" style={{ height: `${(expo.attendeesRegisteredCount / maxAttendees) * 72}px` }} />
                  <span className="bar-bottom-label">{expo.title.split(" ")[0]}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", color: "var(--text-dim)", padding: "20px" }}>
                No data available
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel">
          <p className="panel-label">Exhibitors per Expo</p>
          <div className="bar-chart">
            {exposWithData.length > 0 ? (
              exposWithData.slice(0, 6).map(expo => (
                <div key={expo._id} className="bar-col">
                  <span className="bar-top-label">{expo.boothsBookedCount}</span>
                  <div className="bar" style={{ height: `${(expo.boothsBookedCount / maxExhibitors) * 72}px` }} />
                  <span className="bar-bottom-label">{expo.title.split(" ")[0]}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", color: "var(--text-dim)", padding: "20px" }}>
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Pending Applications Table ── */}
      <div className="glass-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <p className="panel-label" style={{ marginBottom: 0 }}>Pending Applications</p>
          <span className="badge badge-pending">{pendingApplications.length} awaiting</span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Role</th>
                <th>Expo</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApplications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <div className="cell-name">{app.exhibitorId?.name || "Unknown"}</div>
                    <div className="cell-email">{app.exhibitorId?.email || "No email"}</div>
                  </td>
                  <td><span className={`badge badge-${app.exhibitorId?.role || "exhibitor"}`}>{app.exhibitorId?.role || "exhibitor"}</span></td>
                  <td><span className="cell-soft">{app.expoId?.title || "Unknown Expo"}</span></td>
                  <td><span className="cell-date"><Icon.Calendar /> {new Date(app.submittedAt).toLocaleDateString()}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="btn-approve"
                        disabled={busyApplicationId === app._id}
                        onClick={() => onApproveApplication?.(app._id)}
                      >
                        <Icon.Check /> {busyApplicationId === app._id ? "..." : "Approve"}
                      </button>
                      <button
                        className="btn-reject"
                        disabled={busyApplicationId === app._id}
                        onClick={() => onRejectApplication?.(app._id)}
                      >
                        <Icon.X /> {busyApplicationId === app._id ? "..." : "Reject"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

