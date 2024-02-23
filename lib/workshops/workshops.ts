import { parseYAML } from "#/deps.ts";

export interface WorkshopGroup {
  groupID: string;
  workshops: Workshop[];
}

export interface Workshop {
  title: string;
  description?: string;
  timestamp: string;
  url?: string;
}

export function isWorkshop(obj: unknown): obj is Workshop {
  return (
    typeof obj === "object" &&
      obj !== null &&
      typeof (obj as Workshop).title === "string" &&
      (obj as Workshop).description === undefined ||
    typeof (obj as Workshop).description === "string" &&
      typeof (obj as Workshop).timestamp === "string" &&
      (obj as Workshop).url === undefined ||
    typeof (obj as Workshop).url === "string"
  );
}

export function isWorkshops(obj: unknown): obj is Workshop[] {
  return Array.isArray(obj) && obj.every((workshop) => isWorkshop(workshop));
}

export function parseWorkshopsYAML(
  content: string,
): Workshop[] {
  const workshops = parseYAML(content);
  if (!isWorkshops(workshops)) {
    throw new Error("Invalid workshops");
  }

  return workshops;
}
