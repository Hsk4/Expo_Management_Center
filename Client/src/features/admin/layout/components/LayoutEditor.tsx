import { useMemo, useState } from "react";
import type { ExpoLayoutData, BoothPosition } from "../types/layout.types";

interface LayoutEditorProps {
  layout: ExpoLayoutData;
  onLayoutChange: (layout: ExpoLayoutData) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export function LayoutEditor({ layout, onLayoutChange, onSave, isLoading = false }: LayoutEditorProps) {
  const [hoveredBooth, setHoveredBooth] = useState<string | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);

  const totalBooths = useMemo(() => layout.booths.length, [layout.booths]);

  const handleGridChange = (dimension: "rows" | "cols", value: number) => {
    const newValue = Math.max(2, Math.min(dimension === "rows" ? 10 : 15, value));
    const newGridRows = dimension === "rows" ? newValue : layout.gridRows;
    const newGridCols = dimension === "cols" ? newValue : layout.gridCols;

    const newBooths: BoothPosition[] = [];
    let boothCounter = 1;

    for (let row = 1; row <= newGridRows; row++) {
      for (let col = 1; col <= newGridCols; col++) {
        const existingBooth = layout.booths.find((b) => b.row === row && b.col === col);
        newBooths.push({
          boothNumber: existingBooth?.boothNumber || `B${boothCounter}`,
          row,
          col,
          x: (col - 1) * 120,
          y: (row - 1) * 120,
          width: 100,
          height: 100,
          status: existingBooth?.status || "available",
        });
        boothCounter++;
      }
    }

    onLayoutChange({ ...layout, gridRows: newGridRows, gridCols: newGridCols, booths: newBooths, updatedAt: new Date() });
  };

  const handleBoothStatusChange = (boothNumber: string, status: BoothPosition["status"]) => {
    onLayoutChange({
      ...layout,
      booths: layout.booths.map((b) => (b.boothNumber === boothNumber ? { ...b, status } : b)),
      updatedAt: new Date(),
    });
  };

  const getBoothColor = (booth: BoothPosition) => {
    if (booth.status === "disabled") return "#4b5563";
    if (booth.status === "reserved") return "#a78bfa";
    if (booth.status === "booked") return "#f87171";
    return "#36d399";
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Grid Settings</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-[#a0a0b0] block mb-2">Rows</label>
            <div className="flex items-center gap-2">
              <button onClick={() => handleGridChange("rows", layout.gridRows - 1)} className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white text-sm">-</button>
              <input type="number" value={layout.gridRows} onChange={(e) => handleGridChange("rows", parseInt(e.target.value) || layout.gridRows)} className="w-12 px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-white text-center" />
              <button onClick={() => handleGridChange("rows", layout.gridRows + 1)} className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white text-sm">+</button>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#a0a0b0] block mb-2">Columns</label>
            <div className="flex items-center gap-2">
              <button onClick={() => handleGridChange("cols", layout.gridCols - 1)} className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white text-sm">-</button>
              <input type="number" value={layout.gridCols} onChange={(e) => handleGridChange("cols", parseInt(e.target.value) || layout.gridCols)} className="w-12 px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-white text-center" />
              <button onClick={() => handleGridChange("cols", layout.gridCols + 1)} className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white text-sm">+</button>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#a0a0b0] block mb-2">Total Booths</label>
            <div className="px-3 py-2 rounded bg-neutral-900 text-white font-semibold">{totalBooths}</div>
          </div>

          <div>
            <label className="text-xs text-[#a0a0b0] block mb-2">Layout Type</label>
            <div className="px-3 py-2 rounded bg-neutral-900 text-white capitalize text-sm">{layout.templateType}</div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Layout Preview</h3>
        <div className="bg-neutral-900 rounded p-4 overflow-auto" style={{ display: "grid", gridTemplateColumns: `repeat(${layout.gridCols}, minmax(60px, 1fr))`, gap: "8px", maxHeight: "400px" }}>
          {layout.booths.map((booth) => (
            <button
              key={booth.boothNumber}
              onClick={() => setSelectedBooth(booth.boothNumber)}
              onMouseEnter={() => setHoveredBooth(booth.boothNumber)}
              onMouseLeave={() => setHoveredBooth(null)}
              className="p-2 rounded text-center transition hover:scale-105"
              style={{
                backgroundColor: getBoothColor(booth),
                opacity: hoveredBooth === booth.boothNumber ? 0.8 : 1,
                border: selectedBooth === booth.boothNumber ? "2px solid #4c9aff" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="text-xs font-bold text-white">{booth.boothNumber}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedBooth && (
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 className="text-white font-semibold mb-3">Edit Booth: {selectedBooth}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(["available", "reserved", "booked", "disabled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleBoothStatusChange(selectedBooth, status)}
                className={`px-3 py-2 rounded text-sm font-semibold transition ${layout.booths.find((b) => b.boothNumber === selectedBooth)?.status === status ? "bg-[#4c9aff] text-white" : "bg-neutral-800 text-[#a0a0b0] hover:bg-neutral-700"}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={onSave} disabled={isLoading} className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#4c9aff] to-[#a78bfa] hover:from-[#3b82f6] hover:to-[#9333ea] disabled:opacity-50 text-white font-semibold transition">
        {isLoading ? "Saving..." : "Save Layout & Continue"}
      </button>
    </div>
  );
}

