import { injectTextEditorOnCellExpended } from "./injectors/injectTextEditorOnCellExpended";
import { createTextEditor } from "./textEditor/textEditor";
import { addCssStyle, createHtmlElement, println, sleep } from "./utils";
import { watchCellExpanded } from "./watchers/watchCellExpanded";

const defaultText = `? words ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------{"time":1645653752433,"blocks":[{"id":"0nrdNobmJW","type":"paragraph","data":{"text":"oklmssddsss"}},{"id":"i56k-mHVNq","type":"paragraph","data":{"text":"je suis un je&nbsp;"}}],"version":"2.23.2"}`;
const ID_EDITOR = "web-ext-text-editor";

function bootstrapAirtableCss() {
  /* remove blue outline on the new text editor */
  addCssStyle(`
  
 #${ID_EDITOR} [contenteditable='true']:focus {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* input:focus, textarea:focus, [contenteditable='plaintext-only']:focus,  */ // maybe later for these too

`);
}

function insertTextEditorEl(parentEl: Element) {
  parentEl.appendChild(
    createHtmlElement(`
    <div style="width:100%; height:100%;">
        <div id="${ID_EDITOR}"></div>
    </div>
  `)
  );
}

export type BuildTextEditorPayload = {
  parentEl: Element;
  text: string;
  airtableRowId: string;
  airtableColumnId: string;
};

function buildTextEditor({
  parentEl,
  text,
  airtableRowId,
  airtableColumnId,
}: BuildTextEditorPayload) {
  insertTextEditorEl(parentEl);

  const textEditor = createTextEditor({
    id: ID_EDITOR,
    text,
    onChange: (text) => {
      console.log("received", text);
    },
  });
}

async function mainApp() {
  await sleep(500);

  bootstrapAirtableCss();

  watchCellExpanded((action, payload) => {
    action === "created" &&
      injectTextEditorOnCellExpended(payload, buildTextEditor);
  });
}

mainApp();
