const EditorJS = require("./editor");
import IEditorJS from "./types";

class TextEditor {
  editor: IEditorJS;

  constructor(id: string) {
    this.editor = new EditorJS({
      /**
       * Id of Element that should contain Editor instance
       */
      holder: id,
    });
  }

  setText(text: string) {}

  onSaveSync(cb: (text: string) => any) {}
}

export function createTextEditor(id: string): TextEditor {
  return new TextEditor(id);
}
