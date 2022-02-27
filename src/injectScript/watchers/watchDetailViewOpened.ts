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
  getHyperBaseContainerEl,
} from "./watchCellExpanded";

type MultilineRowItem = CellExpandedPayload & {
  rowEl: HTMLDivElement;
};
export type DetailViewOpenedPayload = {
  multilineRows: MultilineRowItem[];
};

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

export function watchDetailViewOpened(
  cb: (action: "deleted" | "created", data?: DetailViewOpenedPayload) => void
) {
  const hyperbaseContainer = getHyperBaseContainerEl();

  triggerEventOnSpecificChild(
    hyperbaseContainer,
    "div:not([class])",
    async (action, el) => {
      console.log("watchDetailViewOpened 1");
      //check to ensure it is the detail view dialog that opened
      const dialogEl: HTMLDivElement = el?.querySelector(
        `div[aria-label="Detail view dialog"]`
      );
      if (!dialogEl) return;
      console.log("watchDetailViewOpened 2");

      if (action == "deleted") return cb(action);

      const dialogActivityIndicatorEl = el.querySelector(
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
  );
}
