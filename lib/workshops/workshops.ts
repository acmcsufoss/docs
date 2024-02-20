import { extract, test } from "#/deps.ts";

export interface WorkshopAttrs {
  title?: string;
  description?: string;
  participants?: string[];
  labels?: string[];
  resources?: string[];
}

export interface Workshop {
  id: string;
  md: string;
  attrs?: WorkshopAttrs;
}

export function parseWorkshop(filename: string, md: string): Workshop {
  const id = filename.replace(/\.md$/, "");
  if (!test(md)) {
    return { id, md };
  }

  const extracted = extract<WorkshopAttrs>(md);
  return {
    id,
    md: extracted.body,
    attrs: extracted.attrs,
  };
}
