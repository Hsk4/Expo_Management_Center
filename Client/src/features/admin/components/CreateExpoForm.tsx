// ─────────────────────────────────────────────
//  CREATE EXPO FORM COMPONENT
// ─────────────────────────────────────────────

import { useState } from "react";
import { Icon } from "./Icons";
import { createExpo, type CreateExpoData, type ExpoLayoutConfig, type ExpoSession } from "../../../services/expo.service";
import { LayoutBuilderPanel } from "./LayoutBuilderPanel";
import { ExpoSessionsEditor } from "./ExpoSessionsEditor";

interface CreateExpoFormProps {
  onExpoCreated: () => void;
}

interface FieldError {
  [key: string]: string;
}

export function CreateExpoForm({ onExpoCreated }: CreateExpoFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [showLayoutBuilder, setShowLayoutBuilder] = useState(false);
  const [layoutConfig, setLayoutConfig] = useState<ExpoLayoutConfig | null>(null);
  const [sessions, setSessions] = useState<ExpoSession[]>([]);

  const [formData, setFormData] = useState<CreateExpoData>({
    title: "",
    description: "",
    theme: "",
    location: "",
    startDate: "",
    endDate: "",
    maxBooths: 0,
    maxAttendees: 0,
    gridRows: 10,
    gridCols: 10,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === "maxBooths" || name === "maxAttendees" || name === "gridRows" || name === "gridCols"
        ? parseInt(value) || 0
        : value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case "title":
        if (!value.trim()) return "Expo title is required";
        if (value.trim().length < 3) return "Title must be at least 3 characters";
        return "";
      case "location":
        if (!value.trim()) return "Location is required";
        return "";
      case "startDate":
        if (!value) return "Start date is required";
        return "";
      case "endDate":
        if (!value) return "End date is required";
        if (formData.startDate && new Date(value) <= new Date(formData.startDate)) {
          return "End date must be after start date";
        }
        return "";
      case "maxBooths":
        if (value < 0) return "Must be 0 or positive";
        return "";
      case "maxAttendees":
        if (value < 0) return "Must be 0 or positive";
        return "";
      default:
        return "";
    }
  };

  const handleFieldBlur = (name: string) => {
    const error = validateField(name, formData[name as keyof CreateExpoData]);
    if (error) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FieldError = {};

    if (!formData.title.trim()) errors.title = "Expo title is required";
    if (formData.title.trim().length < 3) errors.title = "Title must be at least 3 characters";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = "End date must be after start date";
    }
    if (layoutConfig && layoutConfig.booths.length === 0) {
      errors.layout = "Layout must contain at least one booth";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setError("Please fix the errors below before submitting");
      setLoading(false);
      return;
    }

    try {
      const payload: CreateExpoData = {
        ...formData,
        gridRows: layoutConfig ? Math.max(1, formData.gridRows || 1, Math.max(...layoutConfig.booths.map((b) => b.row))) : formData.gridRows,
        gridCols: layoutConfig ? Math.max(1, formData.gridCols || 1, Math.max(...layoutConfig.booths.map((b) => b.col))) : formData.gridCols,
        maxBooths: layoutConfig ? layoutConfig.booths.length : formData.maxBooths,
        layout: layoutConfig || undefined,
        sessions: sessions.filter((session) => session.title.trim() && session.startTime && session.endTime),
      };

      const response = await createExpo(payload);
      if (response.success) {
        setSuccess("✓ Expo created successfully as draft! Redirecting...");
        setFormData({
          title: "",
          description: "",
          theme: "",
          location: "",
          startDate: "",
          endDate: "",
          maxBooths: 0,
          maxAttendees: 0,
          gridRows: 10,
          gridCols: 10,
        });
        setLayoutConfig(null);
        setSessions([]);
        setShowLayoutBuilder(false);
        setTimeout(() => {
          onExpoCreated();
          setSuccess("");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create expo");
    } finally {
      setLoading(false);
    }
  };

  const renderFieldWithError = (
    name: string,
    label: string,
    type: "text" | "number" | "datetime-local" | "textarea" = "text",
    placeholder: string = "",
    required: boolean = false,
    hint?: string
  ) => {
    const hasError = fieldErrors[name];
    const fieldValue = formData[name as keyof CreateExpoData] as string | number | undefined;
    return (
      <div className="form-group">
        <label className="form-label">
          {label}
          {required && <span style={{ color: "#f87171" }}> *</span>}
        </label>
        {type === "textarea" ? (
          <textarea
            name={name}
            value={(fieldValue ?? "") as string | number}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur(name)}
            placeholder={placeholder}
            className={`form-input ${hasError ? "form-input-error" : ""}`}
            rows={4}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={(fieldValue ?? "") as string | number}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur(name)}
            placeholder={placeholder}
            className={`form-input ${hasError ? "form-input-error" : ""}`}
            {...(type === "number" && { min: "0" })}
          />
        )}
        {hint && !hasError && (
          <p style={{ fontSize: "12px", color: "#707085", margin: "4px 0 0 0" }}>
            💡 {hint}
          </p>
        )}
        {hasError && (
          <p style={{ fontSize: "12px", color: "#f87171", margin: "4px 0 0 0" }}>
            ⚠️ {hasError}
          </p>
        )}
      </div>
    );
  };

  const filledFields = [
    formData.title,
    formData.location,
    formData.startDate,
    formData.endDate
  ].filter(Boolean).length;
  const totalRequired = 4;
  const progressPercent = (filledFields / totalRequired) * 100;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Create New Expo</h1>
        <p className="page-subtitle">Set up a new expo event on the platform.</p>
      </div>

      <div className="glass-panel" style={{ maxWidth: "900px" }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px"
          }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#a0a0b0" }}>
              Progress
            </span>
            <span style={{ fontSize: "12px", color: "#4c9aff", fontWeight: "600" }}>
              {filledFields} of {totalRequired} required fields
            </span>
          </div>
          <div style={{
            width: "100%",
            height: "6px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "3px",
            overflow: "hidden",
            border: "1px solid rgba(76, 154, 255, 0.2)"
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: progressPercent === 100
                ? "linear-gradient(90deg, #36d399, #4c9aff)"
                : "linear-gradient(90deg, #4c9aff, #a78bfa)",
              transition: "width 0.3s ease"
            }} />
          </div>
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

        <form onSubmit={handleSubmit} className="expo-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">01 • Basic Information</h3>

            {renderFieldWithError(
              "title",
              "Expo Title",
              "text",
              "e.g., TechWorld Summit 2026",
              true,
              "Give your expo a clear, descriptive name"
            )}

            {renderFieldWithError(
              "description",
              "Description",
              "textarea",
              "Describe your expo event, what visitors can expect, etc.",
              false,
              "Helps attendees understand what your expo is about"
            )}

            <div className="form-row">
              {renderFieldWithError(
                "theme",
                "Theme",
                "text",
                "e.g., Innovation & Technology",
                false,
                "Category of your expo (optional)"
              )}

              {renderFieldWithError(
                "location",
                "Location",
                "text",
                "e.g., Karachi Convention Center",
                true,
                "Physical venue where the expo will be held"
              )}
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="form-section">
            <h3 className="form-section-title">02 • Date & Time</h3>

            <div className="form-row">
              {renderFieldWithError(
                "startDate",
                "Start Date & Time",
                "datetime-local",
                "",
                true,
                "When your expo begins"
              )}

              {renderFieldWithError(
                "endDate",
                "End Date & Time",
                "datetime-local",
                "",
                true,
                "When your expo ends (must be after start date)"
              )}
            </div>
          </div>

          {/* Capacity Section */}
          <div className="form-section">
            <h3 className="form-section-title">03 • Capacity & Layout</h3>

            <div className="form-row">
              {renderFieldWithError(
                "maxBooths",
                "Max Booths",
                "number",
                "0",
                false,
                "Number of exhibitor booths available"
              )}

              {renderFieldWithError(
                "maxAttendees",
                "Max Attendees",
                "number",
                "0",
                false,
                "Maximum number of visitors allowed"
              )}
            </div>

            <div className="form-row">
              {renderFieldWithError(
                "gridRows",
                "Grid Rows",
                "number",
                "10",
                false,
                "Booth grid layout - rows (1-50)"
              )}

              {renderFieldWithError(
                "gridCols",
                "Grid Columns",
                "number",
                "10",
                false,
                "Booth grid layout - columns (1-50)"
              )}
            </div>

            <div style={{ marginTop: "12px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowLayoutBuilder((prev) => !prev)}
              >
                {showLayoutBuilder ? "Hide Layout Builder" : "Customize Layout"}
              </button>

              {layoutConfig && (
                <span style={{ fontSize: "12px", color: "#36d399" }}>
                  ✓ Layout applied: {layoutConfig.templateType || "custom"} · {layoutConfig.booths.length} booths
                </span>
              )}
            </div>

            {fieldErrors.layout && (
              <p style={{ fontSize: "12px", color: "#f87171", marginTop: "6px" }}>⚠️ {fieldErrors.layout}</p>
            )}

            {showLayoutBuilder && (
              <LayoutBuilderPanel
                onApply={(layout) => {
                  setLayoutConfig(layout);
                  const maxRow = Math.max(...layout.booths.map((b) => b.row));
                  const maxCol = Math.max(...layout.booths.map((b) => b.col));
                  setFormData((prev) => ({
                    ...prev,
                    gridRows: maxRow,
                    gridCols: maxCol,
                    maxBooths: layout.booths.length,
                  }));
                  setShowLayoutBuilder(false);
                }}
                onCancel={() => setShowLayoutBuilder(false)}
              />
            )}
          </div>

          <div className="form-section">
            <h3 className="form-section-title">04 • Schedule & Sessions</h3>
            <p style={{ margin: "0 0 14px 0", color: "#a0a0b0", fontSize: "14px" }}>
              Add an agenda for speakers, workshops, and stage sessions. You can still update this later while the expo is in draft.
            </p>
            <ExpoSessionsEditor sessions={sessions} onChange={setSessions} />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading || progressPercent < 100}
              className="btn-primary"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
              title={progressPercent < 100 ? "Fill all required fields first" : "Create expo as draft"}
            >
              {loading ? (
                <>
                  <span style={{
                    display: "inline-block",
                    width: "14px",
                    height: "14px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite"
                  }} />
                  Creating...
                </>
              ) : (
                <>
                  <Icon.Check />
                  Create as Draft
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .form-input-error {
          border-color: #f87171 !important;
          background: rgba(248, 113, 113, 0.05) !important;
        }
      `}</style>
    </div>
  );
}
