// ─────────────────────────────────────────────
//  APPLICATIONS VIEW PAGE
// ─────────────────────────────────────────────

import { useEffect, useMemo, useState } from "react";
import { Icon } from "./Icons";
import {
  getBoothApplications,
  approveBoothApplication,
  rejectBoothApplication,
} from "../../../services/expo.service";

type AppStatus = "pending" | "approved" | "rejected" | "all";

interface BoothApplicationRow {
  _id: string;
  status: "pending" | "approved" | "rejected";
  paymentStatus?: "unpaid" | "paid";
  paymentReference?: string;
  submittedAt: string;
  rejectionReason?: string;
  companyProfile?: { companyName?: string };
  exhibitorId?: { name?: string; email?: string };
  boothId?: { boothNumber?: string; row?: number; col?: number };
  expoId?: { title?: string };
}

export function ApplicationsView() {
  const [statusFilter, setStatusFilter] = useState<AppStatus>("all");
  const [rows, setRows] = useState<BoothApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getBoothApplications();
      if (response?.success) {
        setRows(response.data || []);
      } else {
        setRows([]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch booth applications");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const visibleRows = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((r) => r.status === statusFilter);
  }, [rows, statusFilter]);

  const handleApprove = async (applicationId: string) => {
    try {
      setBusyId(applicationId);
      await approveBoothApplication(applicationId);
      await loadApplications();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to approve application");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    const reason = window.prompt("Optional rejection reason:") || "Application rejected by admin";
    try {
      setBusyId(applicationId);
      await rejectBoothApplication(applicationId, reason);
      await loadApplications();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reject application");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Booth Applications</h1>
        <p className="page-subtitle">Review exhibitor booth applications and approve or reject requests.</p>
      </div>

      <div className="filter-row">
        <button className={`filter-btn ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>All</button>
        <button className={`filter-btn ${statusFilter === "pending" ? "active" : ""}`} onClick={() => setStatusFilter("pending")}>Pending</button>
        <button className={`filter-btn ${statusFilter === "approved" ? "active" : ""}`} onClick={() => setStatusFilter("approved")}>Approved</button>
        <button className={`filter-btn ${statusFilter === "rejected" ? "active" : ""}`} onClick={() => setStatusFilter("rejected")}>Rejected</button>
      </div>

      {error && (
        <div className="glass-panel" style={{ marginBottom: 12, color: "#f87171" }}>
          ⚠ {error}
        </div>
      )}

      <div className="glass-panel">
        {loading ? (
          <div style={{ padding: 16 }}>Loading applications...</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Exhibitor</th>
                  <th>Company</th>
                  <th>Expo</th>
                  <th>Booth</th>
                  <th>Payment</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                      No applications found for this filter.
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <div className="cell-name">{app.exhibitorId?.name || "Unknown"}</div>
                        <div className="cell-email">{app.exhibitorId?.email || "No email"}</div>
                      </td>
                      <td><span className="cell-soft">{app.companyProfile?.companyName || "—"}</span></td>
                      <td><span className="cell-soft">{app.expoId?.title || "Unknown Expo"}</span></td>
                      <td>
                        <span className="cell-soft">
                          {app.boothId?.boothNumber || "-"}
                          {app.boothId?.row && app.boothId?.col ? ` (R${app.boothId.row}C${app.boothId.col})` : ""}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${app.paymentStatus === "paid" ? "badge-approved" : "badge-pending"}`}>
                          {app.paymentStatus || "unpaid"}
                        </span>
                      </td>
                      <td><span className="cell-date"><Icon.Calendar /> {new Date(app.submittedAt).toLocaleDateString()}</span></td>
                      <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                      <td>
                        {app.status === "pending" ? (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button className="btn-approve" disabled={busyId === app._id} onClick={() => handleApprove(app._id)}>
                              <Icon.Check /> {busyId === app._id ? "..." : "Approve"}
                            </button>
                            <button className="btn-reject" disabled={busyId === app._id} onClick={() => handleReject(app._id)}>
                              <Icon.X /> {busyId === app._id ? "..." : "Reject"}
                            </button>
                          </div>
                        ) : (
                          <span className="cell-dim">{app.status === "rejected" ? app.rejectionReason || "rejected" : "resolved"}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
