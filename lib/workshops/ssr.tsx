import { Helmet } from "#/deps.ts";
import { withLayout } from "#/lib/layout/mod.ts";
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
        <th>Workshop series</th>
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
              <ol>
                {props.workshopGroups[groupID].map((workshop) => (
                  <li>
                    <WorkshopPreviewComponent workshop={workshop} />
                  </li>
                ))}
              </ol>
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

      <h1>Workshops</h1>
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
        <th>Title</th>
        <th>Group ID</th>
        <th>Timestamp</th>
      </tr>
      {props.workshops.map((workshop) => (
        <tr>
          <td>
            <WorkshopPreviewComponent workshop={workshop} />
          </td>
          <td>{workshop.group_id ?? "N/A"}</td>
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
