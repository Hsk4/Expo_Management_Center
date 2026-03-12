import { useState } from "react";
import type { LayoutTemplate, EventType } from "../types/layout.types";
import { LAYOUT_TEMPLATES } from "../services/layoutBuilder.service";

interface LayoutTemplateSelectorProps {
  onTemplateSelect: (template: LayoutTemplate, eventType: EventType) => void;
  onImageUpload: (file: File) => void;
  isLoading?: boolean;
}

const EVENT_TYPES: { value: EventType; label: string; icon: string }[] = [
  { value: "job-expo", label: "Job Expo", icon: "💼" },
  { value: "tech-conference", label: "Tech Conference", icon: "💻" },
  { value: "education", label: "Educational Event", icon: "🎓" },
  { value: "trade-show", label: "Trade Show", icon: "🏪" },
  { value: "career-fair", label: "Career Fair", icon: "🎯" },
];

export function LayoutTemplateSelector({ onTemplateSelect, onImageUpload, isLoading = false }: LayoutTemplateSelectorProps) {
  const [selectedEventType, setSelectedEventType] = useState<EventType>("trade-show");
  const [activeTab, setActiveTab] = useState<"templates" | "upload">("templates");

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-white/10">
        <button onClick={() => setActiveTab("templates")} className={`px-4 py-2 font-semibold transition ${activeTab === "templates" ? "text-[#4c9aff] border-b-2 border-[#4c9aff]" : "text-[#a0a0b0] hover:text-white"}`}>
          Pre-built Templates
        </button>
        <button onClick={() => setActiveTab("upload")} className={`px-4 py-2 font-semibold transition ${activeTab === "upload" ? "text-[#4c9aff] border-b-2 border-[#4c9aff]" : "text-[#a0a0b0] hover:text-white"}`}>
          Upload Layout Image
        </button>
      </div>

      {activeTab === "templates" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Select Event Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {EVENT_TYPES.map((eventType) => (
              <button key={eventType.value} onClick={() => setSelectedEventType(eventType.value)} className={`p-3 rounded-lg text-center transition ${selectedEventType === eventType.value ? "bg-[#4c9aff]/20 border-2 border-[#4c9aff]" : "bg-white/5 border-2 border-transparent hover:border-[#4c9aff]/30"}`}>
                <div className="text-2xl mb-1">{eventType.icon}</div>
                <div className="text-xs font-semibold text-[#a0a0b0]">{eventType.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Layout Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LAYOUT_TEMPLATES.map((template) => (
              <button key={template.templateType} onClick={() => onTemplateSelect(template.templateType, selectedEventType)} disabled={isLoading} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#4c9aff]/50 transition disabled:opacity-50">
                <div className="text-2xl mb-2">{template.icon}</div>
                <h4 className="text-white font-semibold mb-1">{template.name}</h4>
                <p className="text-xs text-[#a0a0b0] mb-3">{template.description}</p>
                <div className="flex justify-between text-xs text-[#707085]">
                  <span>{template.gridRows} x {template.gridCols}</span>
                  <span>{template.gridRows * template.gridCols} booths</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "upload" && (
        <div className="space-y-4">
          <div className="p-6 rounded-lg border-2 border-dashed border-[#4c9aff]/30 bg-[#4c9aff]/5">
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])} disabled={isLoading} className="hidden" id="layout-image-input-main" />
            <label htmlFor="layout-image-input-main" className="cursor-pointer block text-center">
              <div className="text-4xl mb-2">📸</div>
              <p className="text-white font-semibold mb-1">Upload Your Layout Image</p>
              <p className="text-xs text-[#a0a0b0]">PNG, JPG or JPEG</p>
              {isLoading && <p className="text-xs text-[#4c9aff] mt-2">Processing image...</p>}
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

