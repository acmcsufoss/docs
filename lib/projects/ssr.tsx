import { CSS, h, Helmet, render, renderSSR } from "#/deps.ts";
import type { Project } from "./projects.ts";

/**
 * makeRepositoryURL returns a URL for the given repository.
 * The given repository string may be a URL or a repository name.
 * If the given repository is a URL, it is returned as is.
 * If the given repository is a repository name, it is converted to a URL
 * by assuming the repository is owned by the acmcsufoss organization.
 */
function makeRepositoryURL(repository: string) {
  if (repository.startsWith("https://")) {
    return repository;
  }

  return `https://github.com/acmcsufoss/${repository}`;
}

function ProjectPageComponent(props: { baseURL: string; project: Project }) {
  const html = render(props.project.md, { baseUrl: props.baseURL });
  return (
    <main>
      <Helmet>
        <html lang="en" amp />
        <title>
          {props.project.attrs?.title} - Open Source Software projects
        </title>
        <meta
          name="description"
          content={props.project.attrs?.description}
        />
        <style>{CSS}</style>
        <script
          src="https://ethanthatonekid.github.io/dropin-minimal-css/switcher.js"
          type="text/javascript"
          defer
        >
        </script>
      </Helmet>

      <article
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}

function ProjectPreviewComponent(props: { project: Project }) {
  return (
    <article class="project-preview">
      <h2>
        <a href={`${props.project.id}.html`}>{props.project.attrs?.title}</a>
      </h2>
      <p>{props.project.attrs?.description}</p>
      <p>
        {props.project.attrs?.repository && (
          <a href={makeRepositoryURL(props.project.attrs?.repository)}>
            <img
              src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
              width="24px"
              alt="GitHub"
            />
          </a>
        )}
      </p>
    </article>
  );
}

function ProjectPreviewListComponent(props: { projects: Project[] }) {
  return (
    <ul>
      {props.projects.map((project) => (
        <li>
          <ProjectPreviewComponent project={project} />
        </li>
      ))}
    </ul>
  );
}

export function ProjectsPageComponent(props: { projects: Project[] }) {
  return (
    <main>
      <Helmet>
        <html lang="en" amp />
        <title>Open Source Software projects</title>
        <meta
          name="description"
          content="List of initiatives owned by the Open Source Software team."
        />
        <script
          src="https://ethanthatonekid.github.io/dropin-minimal-css/switcher.js"
          type="text/javascript"
          defer
        >
        </script>
      </Helmet>
      <h1>Open Source Software projects</h1>
      <ProjectPreviewListComponent projects={props.projects} />
    </main>
  );
}

// deno-lint-ignore no-explicit-any
function renderPageHTML(component: any) {
  const html = renderSSR(component);
  const { body, head, footer, attributes } = Helmet.SSR(html);
  return `<!DOCTYPE html>
<html ${attributes.html.toString()}>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head.join("\n")}
  </head>
  <body ${attributes.body.toString()}>${body}${footer.join("\n")}</body>
</html>`;
}

export function renderProjectsPageHTML(projects: Project[]) {
  return renderPageHTML(<ProjectsPageComponent projects={projects} />);
}

export function renderProjectPageHTML(project: Project, baseURL = "/") {
  return renderPageHTML(
    <ProjectPageComponent project={project} baseURL={baseURL} />,
  );
}
