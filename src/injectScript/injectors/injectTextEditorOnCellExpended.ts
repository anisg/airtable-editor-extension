import { BuildTextEditorPayload } from "../injectScript";
import { createHtmlElement } from "../utils";
import { CellExpandedPayload } from "../watchers/watchCellExpanded";

const CONTAINER_EDITOR_ID = `web-extension-container-editor`;
const containerEditor = `
<div 
id="${CONTAINER_EDITOR_ID}"
style="
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    bottom: 0;
  "
  
  >
  <div style="
    width: auto;
    height: auto;
    padding: 24px;"></div>
</div>
`;

export function injectTextEditorOnCellExpended(
  payload: CellExpandedPayload,
  buildTextEditor: (payload: BuildTextEditorPayload) => any
) {
  const container = payload.fieldEl.appendChild(
    createHtmlElement(containerEditor)
  );
  console.log("container", container, CONTAINER_EDITOR_ID);
  // todo: determine the airtable row id & column id

  return buildTextEditor({
    parentEl: container.children[0],
    text: payload.text,
    airtableRowId: null,
    airtableColumnId: null,
  });
}
