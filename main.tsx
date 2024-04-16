import { copy, Helmet, parseArgs } from "#/deps.ts";
import type { Project } from "#/lib/projects/mod.ts";
import {
  renderProjectPageHTML,
  renderProjectsPageHTML,
  walkProjects,
} from "#/lib/projects/mod.ts";
import {
  renderWorkshopGroupPageHTML,
  renderWorkshopGroupsPageHTML,
  walkWorkshopGroups,
  type WorkshopGroup,
} from "#/lib/workshops/mod.ts";
import { withLayout } from "#/lib/shared/layout/mod.ts";
import { PageHeading } from "#/lib/shared/page_heading/mod.ts";
import { join } from "#/deps.ts";

if (import.meta.main) {
  await main(Deno.args);
}

// Build script for generating static site from markdown files
// in the projects directory.
async function main(args: string[]) {
  const flags = parseArgs(args, {
    string: ["indir", "outdir", "staticdir", "base-url"],
    alias: {
      indir: ["i"],
      outdir: ["o"],
      staticdir: ["s"],
    },
    default: {
      indir: "./",
      outdir: "build",
      staticdir: "static",
    },
  });

  // Create projects directory if it does not exist.
  await Deno.mkdir(join(flags.outdir, "projects"), { recursive: true });

  // Render projects assets.
  const projects: Project[] = [];
  for await (
    const project of walkProjects(join(flags.indir, "projects", "*.md"))
  ) {
    projects.push(project);
    const html = renderProjectPageHTML(project, flags["base-url"]);
    await Deno.writeTextFile(
      join(flags.outdir, "projects", `${project.id}.html`),
      html,
    );
    const json = JSON.stringify(project, null, 2);
    await Deno.writeTextFile(
      join(flags.outdir, "projects", `${project.id}.json`),
      json,
    );
  }

  const projectsIndexHTML = await renderProjectsPageHTML(projects);
  await Deno.writeTextFile(
    join(flags.outdir, "projects.html"),
    projectsIndexHTML,
  );

  // Create workshops directory if it does not exist.
  await Deno.mkdir(join(flags.outdir, "series"), { recursive: true });

  // Render workshops assets.
  const workshopGroups: WorkshopGroup[] = [];
  for await (
    const group of walkWorkshopGroups(join(flags.indir, "workshops", "*.md"))
  ) {
    workshopGroups.push(group);
    const html = renderWorkshopGroupPageHTML(group, flags["base-url"]);
    await Deno.writeTextFile(
      join(flags.outdir, "series", `${group.id}.html`),
      html,
    );
    const json = JSON.stringify(group, null, 2);
    await Deno.writeTextFile(
      join(flags.outdir, "series", `${group.id}.json`),
      json,
    );
  }

  const sortedWorkshopGroups = workshopGroups.sort((a, b) => {
    const workshopA = new Date(a.workshops[0].timestamp ?? 0);
    const workshopB = new Date(b.workshops[0].timestamp ?? 0);
    return workshopA.getTime() - workshopB.getTime();
  });
  const workshopsIndexHTML = renderWorkshopGroupsPageHTML(sortedWorkshopGroups);
  await Deno.writeTextFile(
    `${flags.outdir}/workshops.html`,
    workshopsIndexHTML,
  );
  await Deno.writeTextFile(
    `${flags.outdir}/workshops.json`,
    JSON.stringify(workshopGroups, null, 2),
  );

  // Copy contents of static directory to outdir.
  await copy(flags.staticdir, flags.outdir, { overwrite: true });

  // Render index page.
  await Deno.writeTextFile(
    `${flags.outdir}/index.html`,
    withLayout(
      <main>
        <Helmet>
          <html lang="en" amp />
          <title>Open Source Software docs</title>
          <meta
            name="description"
            content="ACM at CSUF Open Source Software team documentation"
          />
        </Helmet>
        <PageHeading title="docs" />
        <p>
          This is a static documentation site for the{" "}
          <a href="https://github.com/acmcsufoss">
            <strong>@acmcsufoss</strong>
          </a>{" "}
          organization.
          <ul>
            <li>
              <a href="projects.html">Projects</a>
            </li>
            <li>
              <a href="workshops.html">Workshops</a>
            </li>
          </ul>
        </p>
      </main>,
    ),
  );
}
