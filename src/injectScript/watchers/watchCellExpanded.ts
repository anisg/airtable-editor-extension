import {
  println,
  repeatWhileNotTrue,
  sleep,
  triggerEventOnSpecificChild,
} from "../utils";

export const CSS_SELECTOR_HYPERBASE_CONTAINER = `#hyperbaseContainer`;
const CSS_SELECTOR_CHILD_TOP_LAYER = `div.noevents.child-events`;
export const CSS_SELECTOR_CHILD_MULTILINE_FIELD = `div[data-columntype="multilineText"]`;
const CSS_SELECTOR_CHILD_CONTENT_FIELD = `div[data-columntype="multilineText"] .contentEditableTextbox`;

export function getHyperBaseContainerEl() {
  return document.querySelector(CSS_SELECTOR_HYPERBASE_CONTAINER);
}

export type CellExpandedPayload = {
  contentEl: HTMLDivElement;
  fieldEl: HTMLDivElement;
  text: string;
};

export function createMultilinePayload(
  fieldEl: HTMLDivElement
): CellExpandedPayload {
  const contentEl: HTMLDivElement = fieldEl?.querySelector(
    ".contentEditableTextbox"
  );
  return {
    contentEl,
    fieldEl: fieldEl,
    text: contentEl?.innerText,
  };
}

export function watchCellExpanded(
  cb: (action: "deleted" | "created", data?: CellExpandedPayload) => void
) {
  const hyperbaseContainer = getHyperBaseContainerEl();

  triggerEventOnSpecificChild(
    "cellExpanded",
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
        { intervalMs: 20, timeoutMs: 4000 }
      );
      if (!contentEl) return;

      const fieldEl: HTMLDivElement = el?.querySelector(
        CSS_SELECTOR_CHILD_MULTILINE_FIELD
      );
      cb("created", createMultilinePayload(fieldEl));
    }
  );
}
