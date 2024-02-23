import { Helmet } from "#/deps.ts";
import { withLayout } from "#/lib/shared/layout/mod.ts";
import { PageHeading } from "#/lib/shared/page_heading/mod.ts";
import type { Workshop, WorkshopGroup } from "./workshops.ts";

function WorkshopPreviewComponent(props: { workshop: Workshop }) {
  if (!props.workshop.url) {
    return props.workshop.title;
  }

  return <a href={props.workshop.url}>{props.workshop.title}</a>;
}

function WorkshopGroupsTableComponent(
  props: { workshopGroups: WorkshopGroup[] },
) {
  return (
    <table>
      <tr>
        <th>Series</th>
        <th>Workshops</th>
      </tr>
      {props.workshopGroups
        .map((group) => (
          <tr>
            <td>
              <a href={`series/${group.groupID}.html`}>{group.groupID}</a>
            </td>
            <td>{group.workshops.length}</td>
          </tr>
        ))}
    </table>
  );
}

function WorkshopGroupsPageComponent(
  props: { workshopGroups: WorkshopGroup[] },
) {
  return (
    <main>
      <Helmet>
        <html lang="en" amp />
        <title>
          Open Source Software workshops
        </title>
        <meta
          name="description"
          content="Open Source Software workshops"
        />
      </Helmet>

      <PageHeading title="workshops" />
      <WorkshopGroupsTableComponent workshopGroups={props.workshopGroups} />
      <footer>
        <a href="./index.html">↩ Docs</a>
      </footer>
    </main>
  );
}

export function renderWorkshopGroupsPageHTML(
  workshopGroups: WorkshopGroup[],
) {
  return withLayout(
    <WorkshopGroupsPageComponent workshopGroups={workshopGroups} />,
  );
}

function WorkshopGroupTableComponent(
  props: { workshops: Workshop[] },
) {
  return (
    <table>
      <tr>
        <th>#</th>
        <th>Workshop</th>
        <th>Timestamp</th>
      </tr>
      {props.workshops.map((workshop, i) => (
        <tr>
          <td>{i + 1}</td>
          <td>
            <WorkshopPreviewComponent workshop={workshop} />
          </td>
          <td>
            <time dateTime={workshop.timestamp}>
              {workshop.timestamp}
            </time>
          </td>
        </tr>
      ))}
    </table>
  );
}

function WorkshopGroupPageComponent(
  props: { group: WorkshopGroup },
) {
  return (
    <main>
      <Helmet>
        <html lang="en" amp />
        <title>
          {props.group.groupID} - Open Source Software workshops
        </title>
        <meta
          name="description"
          content={`Workshops in the ${props.group.groupID} series`}
        />
      </Helmet>

      <h1>{props.group.groupID}</h1>
      <WorkshopGroupTableComponent workshops={props.group.workshops} />
      <footer>
        <a href="../workshops.html">↩ Workshops</a>
      </footer>
    </main>
  );
}

export function renderWorkshopGroupPageHTML(
  group: WorkshopGroup,
) {
  return withLayout(
    <WorkshopGroupPageComponent group={group} />,
  );
}
