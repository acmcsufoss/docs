import { expandGlob } from "#/deps.ts";
import type { WorkshopGroup } from "./workshops.ts";
import { parseWorkshopsYAML } from "./workshops.ts";

function trimExtension(path: string): string {
  return path.replace(/\.[^.]*$/, "");
}

export async function* walkWorkshopsYAML(glob: string | URL) {
  for await (const stat of expandGlob(glob)) {
    const content = await Deno.readTextFile(stat.path);
    const groupID = trimExtension(stat.name);
    const workshops = parseWorkshopsYAML(content);
    const group: WorkshopGroup = { groupID, workshops };
    yield group;
  }
}
