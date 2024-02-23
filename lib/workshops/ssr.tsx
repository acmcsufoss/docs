import { Helmet } from "#/deps.ts";
import { withLayout } from "#/lib/shared/layout/mod.ts";
import { PageHeading } from "#/lib/shared/page_heading/mod.ts";
import {
  DEFAULT_GROUP_ID,
  type Workshop,
  type WorkshopGroups,
} from "./workshops.ts";

function WorkshopPreviewComponent(props: { workshop: Workshop }) {
  if (!props.workshop.url) {
    return props.workshop.title;
  }

  return <a href={props.workshop.url}>{props.workshop.title}</a>;
}

function WorkshopGroupsTableComponent(
  props: { workshopGroups: WorkshopGroups },
) {
  return (
    <table>
      <tr>
        <th>Series</th>
        <th>Workshops</th>
      </tr>
      {Object.keys(props.workshopGroups)
        .filter((groupID) => groupID !== DEFAULT_GROUP_ID)
        .map((groupID) => (
          <tr>
            <td>
              <a href={`workshops/${groupID}.html`}>{groupID}</a>
            </td>
            <td>
              {props.workshopGroups[groupID].length}
            </td>
          </tr>
        ))}
    </table>
  );
}

function WorkshopGroupsPageComponent(
  props: { workshopGroups: WorkshopGroups },
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
    </main>
  );
}

export function renderWorkshopGroupsPageHTML(
  workshopGroups: WorkshopGroups,
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
  props: { groupID: string; workshops: Workshop[] },
) {
  return (
    <main>
      <Helmet>
        <html lang="en" amp />
        <title>
          {props.groupID} - Open Source Software workshops
        </title>
        <meta
          name="description"
          content={`Workshops in the ${props.groupID} series`}
        />
      </Helmet>

      <h1>{props.groupID}</h1>
      <WorkshopGroupTableComponent workshops={props.workshops} />
    </main>
  );
}

export function renderWorkshopGroupPageHTML(
  groupID: string,
  workshops: Workshop[],
) {
  return withLayout(
    <WorkshopGroupPageComponent groupID={groupID} workshops={workshops} />,
  );
}
