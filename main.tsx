import { copy, Helmet, parseArgs } from "#/deps.ts";
import type { Project } from "#/lib/projects/mod.ts";
import {
  renderProjectPageHTML,
  renderProjectsPageHTML,
  walkProjects,
} from "#/lib/projects/mod.ts";
import {
  groupWorkshops,
  parseWorkshopsYAML,
  renderWorkshopGroupPageHTML,
  renderWorkshopGroupsPageHTML,
} from "#/lib/workshops/mod.ts";
import { withLayout } from "#/lib/layout/mod.ts";

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
      indir: "projects",
      outdir: "build",
      staticdir: "static",
    },
  });

  // Create outdir if it does not exist.
  await Deno.mkdir(flags.outdir, { recursive: true });

  // Render projects assets.
  const projects: Project[] = [];
  for await (const project of walkProjects(`${flags.indir}/*.md`)) {
    projects.push(project);
    const html = renderProjectPageHTML(project, flags["base-url"]);
    await Deno.writeTextFile(`${flags.outdir}/${project.id}.html`, html);
    const json = JSON.stringify(project, null, 2);
    await Deno.writeTextFile(`${flags.outdir}/${project.id}.json`, json);
  }

  const projectsIndexHTML = await renderProjectsPageHTML(projects);
  await Deno.writeTextFile(
    `${flags.outdir}/projects.html`,
    projectsIndexHTML,
  );

  // Create workshops directory if it does not exist.
  await Deno.mkdir(`${flags.outdir}/workshops`, { recursive: true });

  // Render workshops assets.
  const workshopsYAML = await Deno.readTextFile("workshops.yaml");
  const workshopGroups = groupWorkshops(parseWorkshopsYAML(workshopsYAML));
  for (const groupID in workshopGroups) {
    const workshopIndexHTML = renderWorkshopGroupPageHTML(
      groupID,
      workshopGroups[groupID],
    );

    await Deno.writeTextFile(
      `${flags.outdir}/workshops/${groupID}.html`,
      workshopIndexHTML,
    );
    await Deno.writeTextFile(
      `${flags.outdir}/workshops/${groupID}.json`,
      JSON.stringify(workshopGroups[groupID], null, 2),
    );
  }

  const workshopsIndexHTML = renderWorkshopGroupsPageHTML(
    workshopGroups,
  );
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
        <Helmet></Helmet>
        <h1>Home</h1>
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

if (import.meta.main) {
  await main(Deno.args);
}
