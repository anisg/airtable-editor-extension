import { BuildTextEditorPayload } from "../injectScript";
import { createHtmlElement } from "../utils";
import { CellExpandedPayload } from "../watchers/watchCellExpanded";

const CONTAINER_EDITOR_ID = `web-extension-container-editor`;
const containerEditorHtml = `
<div
id="${CONTAINER_EDITOR_ID}"
style="
    min-height: 150px;
    border: 2px solid rgba(0,0,0,0.05);
    border-radius: 6px;
    padding: 12px 20px 12px 26px;
    color: #333333;
    background: white !important;
">
</div>
`;

export function injectTextEditorOnCellExpended(payload: CellExpandedPayload) {
  //1. hide existing airtable editor
  payload.contentEl.style.display = "none";

  //2. hide mention button
  const mentionButton: HTMLElement = payload.contentEl.parentNode.querySelector(
    ".mentionIcon"
  );
  mentionButton.style.display = "none";

  //3. insert new editor container
  payload.contentEl.parentNode.parentNode.parentNode.parentNode.parentNode.lastElementChild.insertAdjacentHTML(
    "afterend",
    containerEditorHtml
  );

  const container: HTMLDivElement = payload.fieldEl.querySelector(
    `#${CONTAINER_EDITOR_ID}`
  );

  //4. remove parent key* event
  container.addEventListener("keydown", (e) => {
    e.stopPropagation();
  });
  container.addEventListener("keypress", (e) => {
    e.stopPropagation();
  });
  container.addEventListener("keyup", (e) => {
    e.stopPropagation();
  });

  return {
    airtableContentEl: payload.contentEl,
    editorContainerEl: container,
    text: payload.text,
  };
}
