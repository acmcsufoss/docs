import { expandGlob } from "#/deps.ts";
import { parseWorkshopGroup } from "./workshops.ts";

export async function* walkWorkshopGroups(glob: string | URL) {
  for await (const stat of expandGlob(glob)) {
    const content = await Deno.readTextFile(stat.path);
    const group = parseWorkshopGroup(stat.name, content);
    yield group;
  }
}
