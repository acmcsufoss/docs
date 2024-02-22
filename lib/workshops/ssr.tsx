import { Helmet } from "#/deps.ts";
import { withLayout } from "#/lib/layout/mod.ts";
import {
  DEFAULT_GROUP_ID,
  type Workshop,
  type WorkshopGroups,
} from "./workshops.ts";

function WorkshopPreviewComponent(props: { workshop: Workshop }) {
  if (props.workshop.urls.length === 0) {
    return props.workshop.title;
  }

  return <a href={props.workshop.urls[0]}>{props.workshop.title}</a>;
}

function WorkshopTableComponent(props: { workshop: Workshop }) {
  return (
    <table>
      <tr>
        <td>Title</td>
        <td>{props.workshop.title}</td>
      </tr>
      {props.workshop.groupID && (
        <tr>
          <td>Group ID</td>
          <td>{props.workshop.groupID}</td>
        </tr>
      )}
      <tr>
        <td>Timestamp</td>
        <td>
          <time dateTime={props.workshop.timestamp}>
            {props.workshop.timestamp}
          </time>
        </td>
      </tr>
      <tr>
        <td>References</td>
        <td>
          <ul>
            {props.workshop.urls.map((url) => (
              <li>
                <a href={url}>{url}</a>
              </li>
            ))}
          </ul>
        </td>
      </tr>
    </table>
  );
}

function WorkshopGroupsTableComponent(
  props: { workshopGroups: WorkshopGroups },
) {
  return (
    <table>
      <tr>
        <th>Workshop series ID</th>
        <th>Workshops series</th>
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
        <script
          src="https://ethanthatonekid.github.io/dropin-minimal-css/switcher.js"
          type="text/javascript"
          defer
        >
        </script>
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
    <div>
      {props.workshops.map((workshop) => (
        <WorkshopTableComponent workshop={workshop} />
      ))}
    </div>
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
        <script
          src="https://ethanthatonekid.github.io/dropin-minimal-css/switcher.js"
          type="text/javascript"
          defer
        >
        </script>
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
