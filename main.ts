import { copy, parseArgs } from "#/deps.ts";
import type { Project } from "#/lib/projects/mod.ts";
import {
  renderProjectPageHTML,
  renderProjectsPageHTML,
  walkProjects,
} from "#/lib/projects/mod.ts";

// Build script for generating static site from markdown files
// in the projects directory.
async function main(args: string[]) {
  const flags = parseArgs(args, {
    string: ["indir", "outdir", "staticdir"],
    alias: {
      indir: ["i"],
      outdir: ["o"],
      staticdir: ["s"],
    },
    default: {
      indir: "projects",
      outdir: "build",
      staticdir: "static",
    },
  });

  // Create outdir if it does not exist.
  await Deno.mkdir(flags.outdir, { recursive: true });

  // Render markdown files to HTML.
  const projects: Project[] = [];
  for await (const project of walkProjects(`${flags.indir}/*.md`)) {
    projects.push(project);
    const html = renderProjectPageHTML(project);
    await Deno.writeTextFile(`${flags.outdir}/${project.id}.html`, html);
    const json = JSON.stringify(project, null, 2);
    await Deno.writeTextFile(`${flags.outdir}/${project.id}.json`, json);
  }

  // Copy contents of static directory to outdir.
  await copy(flags.staticdir, flags.outdir, { overwrite: true });

  // Render index page.
  const html = await renderProjectsPageHTML(projects);
  await Deno.writeTextFile(`${flags.outdir}/index.html`, html);
}

if (import.meta.main) {
  await main(Deno.args);
}
