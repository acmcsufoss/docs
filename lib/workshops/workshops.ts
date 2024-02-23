import { parseYAML } from "#/deps.ts";

export interface Workshop {
  title: string;
  description?: string;
  timestamp: string;
  group_id?: string;
  url?: string;
}

export function isWorkshop(obj: unknown): obj is Workshop {
  return (
    typeof obj === "object" &&
      obj !== null &&
      typeof (obj as Workshop).title === "string" &&
      typeof (obj as Workshop).timestamp === "string" &&
      (obj as Workshop).group_id === undefined ||
    typeof (obj as Workshop).group_id === "string" &&
      (obj as Workshop).url === undefined ||
    typeof (obj as Workshop).url === "string"
  );
}

export function isWorkshops(obj: unknown): obj is Workshop[] {
  return Array.isArray(obj) && obj.every(isWorkshop);
}

export function parseWorkshops(content: string): Workshop[] {
  const workshops = JSON.parse(content);
  if (!isWorkshops(workshops)) {
    throw new Error("Invalid workshops");
  }

  return workshops;
}

export function parseWorkshopsYAML(content: string): Workshop[] {
  const workshops = parseYAML(content);
  if (!isWorkshops(workshops)) {
    throw new Error("Invalid workshops");
  }

  return workshops;
}

export const DEFAULT_GROUP_ID = "-";

export function groupWorkshops(
  workshops: Workshop[],
  defaultGroupID = DEFAULT_GROUP_ID,
) {
  const groups: Record<string, Workshop[]> = {};
  for (const workshop of workshops) {
    const groupID = workshop.group_id ?? defaultGroupID;
    if (!(groupID in groups)) {
      groups[groupID] = [];
    }

    groups[groupID].push(workshop);
  }

  // Sort the workshops by timestamp.
  for (const groupID in groups) {
    groups[groupID].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }

  return groups;
}

export type WorkshopGroups = ReturnType<typeof groupWorkshops>;
