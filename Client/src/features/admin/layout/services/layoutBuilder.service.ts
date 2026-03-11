import type { LayoutTemplate, EventType, BoothPosition, ExpoLayoutData, TemplateConfig, LayoutGenerationRequest, LayoutGenerationResponse } from "../types/layout.types";

export const LAYOUT_TEMPLATES: TemplateConfig[] = [
  { name: "Rectangle Grid", templateType: "rectangle", description: "Standard rectangular booth grid layout", gridRows: 5, gridCols: 8, icon: "[ ]", suggestedEventTypes: ["trade-show", "tech-conference"] },
  { name: "Crescent Moon", templateType: "crescent", description: "Curved crescent layout for compact venues", gridRows: 4, gridCols: 6, icon: "(", suggestedEventTypes: ["career-fair", "education"] },
  { name: "Circle Layout", templateType: "circular", description: "Circular arrangement around center stage", gridRows: 6, gridCols: 6, icon: "O", suggestedEventTypes: ["job-expo", "career-fair"] },
  { name: "Linear Layout", templateType: "linear", description: "Single/double row layout for narrow halls", gridRows: 2, gridCols: 12, icon: "-", suggestedEventTypes: ["education", "career-fair"] },
];

export const generateLayoutFromImage = async (request: LayoutGenerationRequest): Promise<LayoutGenerationResponse> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const gridRows = Math.max(3, Math.min(8, Math.ceil(Math.sqrt(request.estimatedBooths / 2))));
    const gridCols = Math.max(4, Math.ceil(request.estimatedBooths / gridRows));
    const booths: BoothPosition[] = [];
    let boothCounter = 1;

    for (let row = 1; row <= gridRows; row++) {
      for (let col = 1; col <= gridCols; col++) {
        if (boothCounter > request.estimatedBooths) break;
        booths.push({ boothNumber: `B${boothCounter}`, row, col, x: (col - 1) * 100, y: (row - 1) * 100, width: 100, height: 100, status: "available" });
        boothCounter++;
      }
    }

    return {
      success: true,
      message: "Layout generated from image",
      data: {
        gridRows,
        gridCols,
        booths,
        confidence: 0.85,
        stagePosition: { boothNumber: "STAGE", row: 0, col: 0, x: 0, y: 0, width: gridCols * 100, height: 80, status: "reserved" },
      },
    };
  } catch (error) {
    return { success: false, message: `Failed to generate layout: ${error instanceof Error ? error.message : "Unknown error"}` };
  }
};

export const generateLayoutFromTemplate = (template: LayoutTemplate, eventType: EventType, customGridRows?: number, customGridCols?: number): ExpoLayoutData => {
  const templateConfig = LAYOUT_TEMPLATES.find((t) => t.templateType === template) || LAYOUT_TEMPLATES[0];
  const gridRows = customGridRows || templateConfig.gridRows;
  const gridCols = customGridCols || templateConfig.gridCols;

  const booths: BoothPosition[] = [];
  let boothCounter = 1;
  for (let row = 1; row <= gridRows; row++) {
    for (let col = 1; col <= gridCols; col++) {
      booths.push({ boothNumber: `B${boothCounter}`, row, col, x: (col - 1) * 120, y: (row - 1) * 120, width: 100, height: 100, status: "available" });
      boothCounter++;
    }
  }

  return {
    templateType: template,
    eventType,
    gridRows,
    gridCols,
    booths,
    createdAt: new Date(),
    updatedAt: new Date(),
    stagePosition: { x: 0, y: 0, width: gridCols * 120, height: 100 },
    foodStallPositions: [
      { x: gridCols * 60, y: gridRows * 120 + 20, label: "Food Court" },
      { x: gridCols * 60 + 150, y: gridRows * 120 + 20, label: "Cafe" },
    ],
  };
};

export const validateLayout = (layout: ExpoLayoutData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (layout.gridRows < 2 || layout.gridRows > 10) errors.push("Grid rows must be between 2 and 10");
  if (layout.gridCols < 2 || layout.gridCols > 15) errors.push("Grid columns must be between 2 and 15");
  if (layout.booths.length === 0) errors.push("Layout must have at least one booth");
  return { valid: errors.length === 0, errors };
};
