// ─────────────────────────────────────────────
//  DRAFTED EXPOS VIEW COMPONENT
// ─────────────────────────────────────────────

import { useState } from "react";
import { Icon } from "./Icons";
import { publishExpo, deleteExpo, updateExpo, type ExpoData, type ExpoSession } from "../../../services/expo.service";
import { formatDate } from "../utils/expoHelpers";
import { ExpoSessionsEditor } from "./ExpoSessionsEditor";

interface DraftedExposViewProps {
  expos: ExpoData[];
  onExpoUpdated: () => void;
}

export function DraftedExposView({ expos, onExpoUpdated }: DraftedExposViewProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingScheduleExpoId, setEditingScheduleExpoId] = useState<string | null>(null);
  const [scheduleDraft, setScheduleDraft] = useState<ExpoSession[]>([]);

  // Filter only draft expos
  const draftedExpos = expos.filter(expo => expo.status === "draft");

  const handlePublish = async (id: string) => {
    setLoading(id);
    setError("");
    setSuccess("");

    try {
      const response = await publishExpo(id);
      if (response.success) {
        setSuccess("Expo published successfully!");
        setTimeout(() => {
          onExpoUpdated();
          setSuccess("");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to publish expo");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this draft expo?")) return;

    setLoading(id);
    setError("");

    try {
      const response = await deleteExpo(id);
      if (response.success) {
        setSuccess("Expo deleted successfully!");
        setTimeout(() => {
          onExpoUpdated();
          setSuccess("");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete expo");
    } finally {
      setLoading(null);
    }
  };

  const openScheduleEditor = (expo: ExpoData) => {
    setEditingScheduleExpoId(expo._id);
    setScheduleDraft(expo.sessions || []);
    setError("");
    setSuccess("");
  };

  const handleSaveSchedule = async (expoId: string) => {
    setLoading(expoId);
    setError("");
    setSuccess("");

    try {
      const response = await updateExpo(expoId, {
        sessions: scheduleDraft.filter((session) => session.title.trim() && session.startTime && session.endTime),
      });

      if (response.success) {
        setSuccess("Schedule updated successfully!");
        setEditingScheduleExpoId(null);
        setScheduleDraft([]);
        onExpoUpdated();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update schedule");
    } finally {
      setLoading(null);
    }
  };

  const handleSetEntryFee = async (expo: ExpoData) => {
    const current = expo.paymentAmount ?? 499;
    const next = window.prompt("Set entry fee in cents", String(current));
    if (next === null) return;

    const parsed = Number(next);
    if (!Number.isFinite(parsed) || parsed < 0) {
      setError("Entry fee must be a non-negative number");
      return;
    }

    setLoading(expo._id);
    setError("");
    setSuccess("");

    try {
      const response = await updateExpo(expo._id, { paymentAmount: Math.round(parsed) });
      if (response.success) {
        setSuccess("Entry fee updated successfully");
        onExpoUpdated();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update entry fee");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Drafted Expos</h1>
        <p className="page-subtitle">Manage your expo drafts. Review and publish when ready.</p>
      </div>

      {error && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          padding: "12px 16px",
          background: "rgba(248, 113, 113, 0.1)",
          border: "1px solid rgba(248, 113, 113, 0.3)",
          borderRadius: "8px",
          color: "#f87171"
        }}>
          <Icon.X />
          {error}
        </div>
      )}

      {success && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          padding: "12px 16px",
          background: "rgba(54, 211, 153, 0.1)",
          border: "1px solid rgba(54, 211, 153, 0.3)",
          borderRadius: "8px",
          color: "#36d399"
        }}>
          <Icon.Check />
          {success}
        </div>
      )}

      <div className="glass-panel">
        {draftedExpos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-dim)" }}>
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>No drafted expos</p>
            <p style={{ fontSize: "14px" }}>Create a new expo to get started.</p>
          </div>
        ) : (
          <div className="drafted-expos-grid">
            {draftedExpos.map(expo => (
              <div key={expo._id} className="draft-expo-card">
                <div className="draft-card-header">
                  <div>
                    <h3 className="draft-card-title">{expo.title}</h3>
                    <p className="draft-card-subtitle">{expo.theme || "No theme specified"}</p>
                  </div>
                  <span className="badge badge-draft">DRAFT</span>
                </div>

                <div className="draft-card-content">
                  <div className="draft-card-row">
                    <span className="draft-card-label">Location:</span>
                    <span className="draft-card-value">{expo.location}</span>
                  </div>

                  <div className="draft-card-row">
                    <span className="draft-card-label">Dates:</span>
                    <span className="draft-card-value">
                      {formatDate(expo.startDate)} - {formatDate(expo.endDate)}
                    </span>
                  </div>

                  <div className="draft-card-row">
                    <span className="draft-card-label">Capacity:</span>
                    <span className="draft-card-value">
                      {expo.maxBooths} booths, {expo.maxAttendees} attendees
                    </span>
                  </div>

                  <div className="draft-card-row">
                    <span className="draft-card-label">Entry fee:</span>
                    <span className="draft-card-value">${((expo.paymentAmount ?? 499) / 100).toFixed(2)}</span>
                  </div>

                  {expo.description && (
                    <div className="draft-card-row">
                      <span className="draft-card-label">Description:</span>
                      <p className="draft-card-description">{expo.description}</p>
                    </div>
                  )}

                  <div className="draft-card-row">
                    <span className="draft-card-label">Created:</span>
                    <span className="draft-card-value">{formatDate(expo.createdAt)}</span>
                  </div>

                  <div className="draft-card-row">
                    <span className="draft-card-label">Sessions:</span>
                    <span className="draft-card-value">{expo.sessions?.length || 0} added</span>
                  </div>
                </div>

                <div className="draft-card-actions">
                  <button
                    onClick={() => handleSetEntryFee(expo)}
                    disabled={loading === expo._id}
                    className="btn-secondary"
                    title="Set entry fee"
                  >
                    Fee
                  </button>
                  <button
                    onClick={() => openScheduleEditor(expo)}
                    disabled={loading === expo._id}
                    className="btn-secondary"
                    title="Edit draft schedule"
                  >
                    Schedule
                  </button>
                  <button
                    onClick={() => handlePublish(expo._id)}
                    disabled={loading === expo._id}
                    className="btn-publish"
                    title="Publish this expo"
                  >
                    <Icon.Check />
                    {loading === expo._id ? "Publishing..." : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDelete(expo._id)}
                    disabled={loading === expo._id}
                    className="btn-delete"
                    title="Delete this draft"
                  >
                    <Icon.X />
                    Delete
                  </button>
                </div>

                {editingScheduleExpoId === expo._id && (
                  <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "white", fontSize: "16px" }}>Manage Schedule</h4>
                    <p style={{ margin: "0 0 14px 0", color: "#a0a0b0", fontSize: "13px" }}>
                      Update this draft agenda before publishing the expo.
                    </p>

                    <ExpoSessionsEditor sessions={scheduleDraft} onChange={setScheduleDraft} />

                    <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                      <button className="btn-publish" disabled={loading === expo._id} onClick={() => handleSaveSchedule(expo._id)}>
                        {loading === expo._id ? "Saving..." : "Save schedule"}
                      </button>
                      <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => {
                          setEditingScheduleExpoId(null);
                          setScheduleDraft([]);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

