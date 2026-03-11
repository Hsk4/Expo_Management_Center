import { useState } from "react";
import { LayoutTemplateSelector } from "../layout/components/LayoutTemplateSelector";
import { LayoutEditor } from "../layout/components/LayoutEditor";
import type { EventType, ExpoLayoutData, LayoutTemplate } from "../layout/types/layout.types";
import { generateLayoutFromImage, generateLayoutFromTemplate, validateLayout } from "../layout/services/layoutBuilder.service";

type LayoutApplyPayload = {
  templateType?: string;
  eventType?: string;
  customImageUrl?: string;
  stagePosition?: { x: number; y: number; width: number; height: number };
  foodStallPositions?: { x: number; y: number; label: string }[];
  booths: { boothNumber: string; row: number; col: number; status: "available" | "reserved" | "booked" | "disabled" }[];
};

interface LayoutBuilderPanelProps {
  onApply: (layout: LayoutApplyPayload) => void;
  onCancel: () => void;
}

type Step = "select" | "edit" | "preview";

export function LayoutBuilderPanel({ onApply, onCancel }: LayoutBuilderPanelProps) {
  const [step, setStep] = useState<Step>("select");
  const [layout, setLayout] = useState<ExpoLayoutData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTemplateSelect = async (template: LayoutTemplate, eventType: EventType) => {
    setIsLoading(true);
    setError("");
    try {
      const newLayout = generateLayoutFromTemplate(template, eventType);
      setLayout(newLayout);
      setStep("edit");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate layout");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setError("");
    try {
      const imageUrl = URL.createObjectURL(file);
      const result = await generateLayoutFromImage({
        imageUrl,
        eventType: "trade-show",
        estimatedBooths: 50,
      });
      if (!result.success || !result.data) {
        throw new Error(result.message || "Image analysis failed");
      }

      setLayout({
        templateType: "custom",
        eventType: "trade-show",
        gridRows: result.data.gridRows,
        gridCols: result.data.gridCols,
        booths: result.data.booths,
        customImageUrl: imageUrl,
        stagePosition: result.data.stagePosition
          ? {
              x: result.data.stagePosition.x,
              y: result.data.stagePosition.y,
              width: result.data.stagePosition.width,
              height: result.data.stagePosition.height,
            }
          : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setStep("edit");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to process image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!layout) return;
    const validation = validateLayout(layout);
    if (!validation.valid) {
      setError(validation.errors.join(", "));
      return;
    }
    setStep("preview");
  };

  const handleApply = () => {
    if (!layout) return;
    onApply({
      templateType: layout.templateType,
      eventType: layout.eventType,
      customImageUrl: layout.customImageUrl,
      stagePosition: layout.stagePosition,
      foodStallPositions: layout.foodStallPositions,
      booths: layout.booths.map((b) => ({
        boothNumber: b.boothNumber,
        row: b.row,
        col: b.col,
        status: b.status,
      })),
    });
  };

  return (
    <div className="glass-panel" style={{ marginTop: "18px" }}>
      <div className="page-header" style={{ marginBottom: "12px" }}>
        <h2 className="page-title" style={{ fontSize: "1.4rem" }}>Layout Builder</h2>
        <p className="page-subtitle">Design the booth map before creating the expo draft.</p>
      </div>

      {error && (
        <div style={{ marginBottom: "12px", color: "#f87171", fontSize: "13px" }}>⚠️ {error}</div>
      )}

      {step === "select" && (
        <LayoutTemplateSelector
          onTemplateSelect={handleTemplateSelect}
          onImageUpload={handleImageUpload}
          isLoading={isLoading}
        />
      )}

      {step === "edit" && layout && (
        <LayoutEditor layout={layout} onLayoutChange={setLayout} onSave={handleContinue} isLoading={isLoading} />
      )}

      {step === "preview" && layout && (
        <div className="space-y-4">
          <p style={{ color: "#a0a0b0", fontSize: "14px" }}>
            Template: <strong>{layout.templateType}</strong> · Grid: {layout.gridRows}x{layout.gridCols} · Booths: {layout.booths.length}
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn-secondary" onClick={() => setStep("edit")}>Back to edit</button>
            <button className="btn-primary" onClick={handleApply}>Apply to Expo Form</button>
            <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
