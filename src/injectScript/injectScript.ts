import { injectTextEditorOnCellExpended } from "./injectors/injectTextEditorOnCellExpended";
import { createTextEditor } from "./textEditor/textEditor";
import { addCssStyle, createHtmlElement, println, sleep } from "./utils";
import { watchCellExpanded } from "./watchers/watchCellExpanded";
import { watchDetailViewOpened } from "./watchers/watchDetailViewOpened";

const defaultText = `? words ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------{"time":1645653752433,"blocks":[{"id":"0nrdNobmJW","type":"paragraph","data":{"text":"oklmssddsss"}},{"id":"i56k-mHVNq","type":"paragraph","data":{"text":"je suis un je&nbsp;"}}],"version":"2.23.2"}`;
const ID_EDITOR = "web-ext-text-editor";

function bootstrapAirtableCss() {
  // remove blue outline on the new text editor
  addCssStyle(`
  
 #${ID_EDITOR} [contenteditable='true']:focus {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* input:focus, textarea:focus, [contenteditable='plaintext-only']:focus,  */ // maybe later for these too

`);
}

function fixEditorJsCss() {
  // remove override css
  addCssStyle(`
  .ce-toolbar__actions {
    position: absolute;
    right: 100% !important;
}

/* by default editorJs has padding bottom at 300px */
.codex-editor__redactor {
  padding-bottom: 20px !important;
}
.ce-toolbox {
  display: none !important;
}
.ce-toolbox--opened {
  display: flex !important;
}

.ce-inline-toolbar {
  display: none !important;
}


.ce-inline-toolbar--showed {
  display: block !important;
}

/* for some reason, airtable was reseting the list style */
.cdx-list__item {
  list-style: inherit !important;
}

/* works only for detail view */
#${ID_EDITOR} [contenteditable='true'] {
  border-width: 0 !important;
}

.ce-settings {
  -webkit-box-sizing: content-box !important;
  box-sizing: content-box !important;
}

/* fix checkbox icon weird position on detail view */
.DetailViewWithActivityFeed .cdx-checklist__item-checkbox::after {
  top: 5px !important;
  left: 4px !important;
}

.ce-toolbar__actions {
  flex-direction: column-reverse !important;
}

/* I wasn't able to display the settings popup, so I moved it to bottom */
.DetailViewWithActivityFeed .ce-settings.ce-settings--opened {
  right: unset;
  top: 30px;
}

.ce-code__textarea {
  min-height: 100px !important;
}

  `);
}
function insertTextEditorEl(parentEl: Element) {
  parentEl.appendChild(
    createHtmlElement(`
    <div style="width:100%; height:100%;">
        <div id="${ID_EDITOR}" class="baymax"></div>
    </div>
  `)
  );
}

export type BuildTextEditorPayload = {
  editorContainerEl: HTMLDivElement;
  text: string;
  airtableContentEl?: HTMLDivElement;
};

async function updateAirtableCell({
  text,
  contentEl,
}: {
  contentEl: HTMLDivElement;
  text: string;
}) {
  const trimmedText = text.trim();
  contentEl.innerText = trimmedText;
  contentEl.dispatchEvent(new Event("input", { bubbles: true }));
}

function buildTextEditor({
  editorContainerEl,
  text,
  airtableContentEl,
}: BuildTextEditorPayload) {
  insertTextEditorEl(editorContainerEl);
  createTextEditor({
    id: ID_EDITOR,
    text,
    onChange: (text) => {
      updateAirtableCell({ text, contentEl: airtableContentEl });
    },
  });
}

function detectTablePageChange(cb: () => void) {
  /* we are waiting until we are inside Table page */
  let url = window.location.href;
  ["click", "popstate", "onload"].forEach((evt) =>
    window.addEventListener(
      evt,
      function () {
        requestAnimationFrame(() => {
          if (url !== location.href) {
            cb();
          }
          url = location.href;
        });
      },
      true
    )
  );
}

async function watchEventsOnTablePage() {
  bootstrapAirtableCss();
  fixEditorJsCss();

  watchCellExpanded((action, payload) => {
    if (action === "deleted") return;
    println("watchCellExpanded", payload);
    const payloadInjector = injectTextEditorOnCellExpended(payload);
    buildTextEditor(payloadInjector);
  });

  watchDetailViewOpened((action, payload) => {
    if (action === "deleted") return;
    println("watchDetailViewOpened", payload.multilineRows);
    payload.multilineRows.forEach((row) => {
      const payloadInjector = injectTextEditorOnCellExpended(row);
      buildTextEditor(payloadInjector);
    });
  });
}

/* entry point of the script */
async function main() {
  // detectTablePageChange(() => watchEventsOnTablePage());
  window.addEventListener("load", async () => {
    watchEventsOnTablePage();
  });
}

main();
