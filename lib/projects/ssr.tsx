import { Helmet, render } from "#/deps.ts";
import { withLayout } from "#/lib/shared/layout/mod.ts";
import { PageHeading } from "#/lib/shared/page_heading/mod.ts";
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

function ParticipantComponent(props: { participant: string }) {
  if (props.participant.startsWith("@")) {
    const url = `https://github.com/${props.participant.slice(1)}`;
    return <a href={url}>{props.participant}</a>;
  }

  return props.participant;
}

function ParticipantsComponent(props: { participants: string[] }) {
  return (
    <ul>
      {props.participants.map((participant) => (
        <li>
          <ParticipantComponent participant={participant} />
        </li>
      ))}
    </ul>
  );
}

function GitHubRepositoryComponent(props: { repository: string }) {
  return (
    <a
      href={makeRepositoryURL(props.repository)}
    >
      {makeRepositoryURL(props.repository)}
    </a>
  );
}

function ProjectMetadataTableComponent(props: { project: Project }) {
  return (
    <table>
      <tr>
        <td colspan="2">
          <b>Metadata</b>
        </td>
      </tr>

      {props.project.attrs?.title && (
        <tr>
          <td>Title</td>
          <td>{props.project.attrs.title}</td>
        </tr>
      )}

      {props.project.attrs?.description && (
        <tr>
          <td>Description</td>
          <td>{props.project.attrs.description}</td>
        </tr>
      )}

      {props.project.attrs?.labels?.length && (
        <tr>
          <td>Labels</td>
          <td>{props.project.attrs.labels.join(", ")}</td>
        </tr>
      )}

      {props.project.attrs?.participants?.length && (
        <tr>
          <td>Participants</td>
          <td>
            <ParticipantsComponent
              participants={props.project.attrs.participants}
            />
          </td>
        </tr>
      )}

      {props.project.attrs?.repository && (
        <tr>
          <td>GitHub repository</td>
          <td>
            <GitHubRepositoryComponent
              repository={props.project.attrs.repository}
            />
          </td>
        </tr>
      )}
    </table>
  );
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
      </Helmet>

      <article
        class="markdown-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <ProjectMetadataTableComponent project={props.project} />

      <footer>
        <a href="../projects.html">↩ Projects</a>
      </footer>
    </main>
  );
}

function ProjectsTableComponent(props: { projects: Project[] }) {
  return (
    <table>
      <tr>
        <th>Title</th>
        <th>Labels</th>
        <th>Participants</th>
      </tr>
      {props.projects.map((project) => (
        <tr>
          <td>
            <a href={`projects/${project.id}.html`}>{project.attrs?.title}</a>
          </td>
          <td>{project.attrs?.labels?.join(", ")}</td>
          <td>{project.attrs?.participants?.length ?? "N/A"}</td>
        </tr>
      ))}
    </table>
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
      </Helmet>

      <PageHeading title="projects" />
      <ProjectsTableComponent projects={props.projects} />
      <footer>
        <a href="./index.html">↩ Docs</a>
      </footer>
    </main>
  );
}

export function renderProjectsPageHTML(projects: Project[]) {
  return withLayout(<ProjectsPageComponent projects={projects} />);
}

export function renderProjectPageHTML(project: Project, baseURL = "/") {
  return withLayout(
    <ProjectPageComponent project={project} baseURL={baseURL} />,
  );
}
