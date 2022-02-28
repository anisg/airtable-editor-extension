import {
  println,
  repeatWhileNotTrue,
  sleep,
  triggerEventOnSpecificChild,
} from "../utils";
import {
  CellExpandedPayload,
  createMultilinePayload,
  CSS_SELECTOR_CHILD_MULTILINE_FIELD,
  CSS_SELECTOR_HYPERBASE_CONTAINER,
  getHyperBaseContainerEl,
} from "./watchCellExpanded";

type MultilineRowItem = CellExpandedPayload & {
  rowEl: HTMLDivElement;
};
export type DetailViewOpenedPayload = {
  multilineRows: MultilineRowItem[];
};

type CallBackWatchDetailViewOpened = (
  action: "deleted" | "created",
  data?: DetailViewOpenedPayload
) => void;

function findEachMultilineRows(
  dialogContainerEl: HTMLDivElement
): HTMLDivElement[] {
  return [
    ...dialogContainerEl.querySelectorAll(".detailView .labelCellPair"),
  ].filter(
    (rowEl) => rowEl.querySelector(CSS_SELECTOR_CHILD_MULTILINE_FIELD) != null
  ) as HTMLDivElement[];
}

function applyCssChangeOnDetailViewMultilineRow(
  multilineRowEl: HTMLDivElement
) {
  multilineRowEl.classList.remove("flex");
}

async function findAllMultilineFields(
  dialogEl: HTMLDivElement,
  cb: CallBackWatchDetailViewOpened
) {
  const dialogActivityIndicatorEl = dialogEl.querySelector(
    `div[data-testid="DetailViewWithActivityFeedLoadingIndicator"]`
  );

  await repeatWhileNotTrue(
    () => {
      const x = dialogActivityIndicatorEl.classList.contains("hide");
      console.log("N>", x);
      return x;
    },
    { intervalMs: 20, timeoutMs: 4000 }
  );

  const rows = findEachMultilineRows(dialogEl);

  rows.forEach((row) => {
    applyCssChangeOnDetailViewMultilineRow(row);
  });

  cb("created", {
    multilineRows: rows.map((row) => ({
      ...createMultilinePayload(
        row.querySelector(CSS_SELECTOR_CHILD_MULTILINE_FIELD)
          .parentNode as HTMLDivElement
      ),
      rowEl: row,
    })),
  });
}

async function triggerIfCurrentPageIsDetailViewDialog(
  cb: CallBackWatchDetailViewOpened
) {
  const dialogEl: HTMLDivElement = document.querySelector(
    `${CSS_SELECTOR_HYPERBASE_CONTAINER} > div:not([class]) div[aria-label="Detail view dialog"]`
  );
  if (!dialogEl) return;
  console.log("current page is multiline fields");
  findAllMultilineFields(dialogEl, cb);
}

export function watchDetailViewOpened(cb: CallBackWatchDetailViewOpened) {
  const hyperbaseContainer = getHyperBaseContainerEl();

  triggerEventOnSpecificChild(
    "detailViewOpened",
    hyperbaseContainer,
    "div:not([class])",
    async (action, el) => {
      //check to ensure it is the detail view dialog that opened
      const dialogEl: HTMLDivElement = el?.querySelector(
        `div[aria-label="Detail view dialog"]`
      );
      if (!dialogEl) return;

      if (action == "deleted") return cb(action);
      findAllMultilineFields(dialogEl, cb);
    }
  );

  triggerIfCurrentPageIsDetailViewDialog(cb);
}
