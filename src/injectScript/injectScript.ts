import { println } from "./utils";
import { watchCellExpanded } from "./watchers/watchCellExpanded";

async function mainApp() {
  println("mainApp");
  // app = await AppStorage.get("app", defaultAppData)
  // await sleep(200)
  // findProperties();
  watchCellExpanded(() => {
    console.log("we thing we have expanded a content cell!");
  });
}

let url = window.location.href;

mainApp();
