import { createTextEditor } from "./textEditor/textEditor";
import { println, sleep } from "./utils";
import { watchCellExpanded } from "./watchers/watchCellExpanded";

async function mainApp() {
  await sleep(500);
  println("mainApp2");
  // app = await AppStorage.get("app", defaultAppData)
  // await sleep(200)
  // findProperties();
  const el = document.querySelector("#appControlsContainer");
  el.insertAdjacentHTML(
    "afterend",
    `<div id="editor" style="width:100%; height:250px; background:white;">HELLO</div>`
  );
  const textEditor = createTextEditor("editor");
  textEditor.setText("hello world");
  // watchCellExpanded(() => {
  //   console.log("we thing we have expanded a content cell!");
  // });
}

let url = window.location.href;

mainApp();
