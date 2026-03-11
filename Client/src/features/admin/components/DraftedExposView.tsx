// ─────────────────────────────────────────────
//  DRAFTED EXPOS VIEW COMPONENT
// ─────────────────────────────────────────────

import { useState } from "react";
import { Icon } from "./Icons";
import { publishExpo, deleteExpo, type ExpoData } from "../../../services/expo.service";
import { formatDate } from "../utils/expoHelpers";

interface DraftedExposViewProps {
  expos: ExpoData[];
  onExpoUpdated: () => void;
}

export function DraftedExposView({ expos, onExpoUpdated }: DraftedExposViewProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
                </div>

                <div className="draft-card-actions">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

