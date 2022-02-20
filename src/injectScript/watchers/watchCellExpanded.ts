import { println } from "../utils";

const CSS_SELECTOR_TOP_LAYER = ``;

function getTopLayerEl() {
  const divEl = document.querySelector(CSS_SELECTOR_TOP_LAYER);
  return divEl;
}

function triggerEventOnChildCreation(targetNode: Element, callback) {
  var config = {
    attributes: true,
    childList: true,
    subtree: true,
  };

  var observer = new MutationObserver((mutationsList) => {
    console.log("mutationsList", mutationsList);
    callback();
  });

  observer.observe(targetNode, config);
}

export function watchCellExpanded(cb: () => void) {
  println("mainApp");
  const topLayerEl = getTopLayerEl();

  println("start to observe", topLayerEl);
  triggerEventOnChildCreation(topLayerEl, () => {});
}
