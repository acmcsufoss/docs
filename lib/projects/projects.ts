import { extract, test } from "#/deps.ts";

export interface ProjectAttrs {
  title?: string;
  description?: string;
  participants?: string[];
  labels?: string[];
  repository?: string;
}

export interface Project {
  id: string;
  md: string;
  attrs?: ProjectAttrs;
}

export function parseProject(filename: string, md: string): Project {
  const id = filename.replace(/\.md$/, "");
  if (!test(md)) {
    return { id, md };
  }

  const extracted = extract<ProjectAttrs>(md);
  return {
    id,
    md: extracted.body,
    attrs: extracted.attrs,
  };
}
