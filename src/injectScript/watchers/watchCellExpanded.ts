import {
  println,
  repeatWhileNotTrue,
  sleep,
  triggerEventOnSpecificChild,
} from "../utils";

const CSS_SELECTOR_HYPERBASE_CONTAINER = `#hyperbaseContainer`;
const CSS_SELECTOR_CHILD_TOP_LAYER = `div.noevents.child-events`;
const CSS_SELECTOR_CHILD_MULTILINE_FIELD = `div[data-columntype="multilineText"]`;
const CSS_SELECTOR_CHILD_CONTENT_FIELD = `div[data-columntype="multilineText"] .contentEditableTextbox`;

function getHyperBaseContainerEl() {
  return document.querySelector(CSS_SELECTOR_HYPERBASE_CONTAINER);
}

export type CellExpandedPayload = {
  contentEl: HTMLDivElement;
  fieldEl: HTMLDivElement;
  text: string;
};

export function watchCellExpanded(
  cb: (action: "deleted" | "created", data?: CellExpandedPayload) => void
) {
  const hyperbaseContainer = getHyperBaseContainerEl();

  triggerEventOnSpecificChild(
    hyperbaseContainer,
    CSS_SELECTOR_CHILD_TOP_LAYER,
    async (action, el) => {
      if (action == "deleted") return cb(action);
      let contentEl = null;
      await repeatWhileNotTrue(
        () => {
          contentEl = el?.querySelector(CSS_SELECTOR_CHILD_CONTENT_FIELD);
          return contentEl !== null;
        },
        { intervalMs: 20, timeoutMs: 2000 }
      );
      if (!contentEl) return;
      cb("created", {
        contentEl: contentEl,
        fieldEl: el?.querySelector(CSS_SELECTOR_CHILD_MULTILINE_FIELD),
        text: contentEl.textContent,
      });
    }
  );
}

const X = `div[data-columntype="multilineText"]`;
