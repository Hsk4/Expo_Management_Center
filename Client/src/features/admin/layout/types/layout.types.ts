export type LayoutTemplate = "rectangle" | "crescent" | "circular" | "linear" | "custom";
export type EventType = "job-expo" | "tech-conference" | "education" | "trade-show" | "career-fair" | "custom";

export interface BoothPosition {
  boothNumber: string;
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  status: "available" | "reserved" | "booked" | "disabled";
}

export interface ExpoLayoutData {
  templateType: LayoutTemplate;
  eventType: EventType;
  gridRows: number;
  gridCols: number;
  booths: BoothPosition[];
  customImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  stagePosition?: { x: number; y: number; width: number; height: number };
  foodStallPositions?: { x: number; y: number; label: string }[];
}

export interface TemplateConfig {
  name: string;
  templateType: LayoutTemplate;
  description: string;
  gridRows: number;
  gridCols: number;
  icon: string;
  suggestedEventTypes: EventType[];
}

export interface LayoutGenerationRequest {
  imageUrl: string;
  eventType: EventType;
  estimatedBooths: number;
}

export interface LayoutGenerationResponse {
  success: boolean;
  message: string;
  data?: {
    gridRows: number;
    gridCols: number;
    booths: BoothPosition[];
    stagePosition?: BoothPosition;
    confidence: number;
  };
}

