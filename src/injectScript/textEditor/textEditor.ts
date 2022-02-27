import { debounceImmediate, sleep } from "../utils";
import IEditorJS, { API, OutputData } from "./types";
const EditorJS = require("./editor");
const Header = require("@editorjs/header");

const prefixSeparator =
  "------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------";
const genPrefix = (wordsCound = "?") =>
  `${wordsCound} words ${prefixSeparator}`;

type TextEditorParams = {
  id: string;
  onChange: (text: string) => any;
  text?: string;
};
class TextEditor {
  debouncedSave: ReturnType<typeof debounceImmediate>;
  editor: IEditorJS;

  constructor({ id, onChange }: TextEditorParams) {
    this.debouncedSave = debounceImmediate(async () => {
      console.log("called onSaveSync!");
      const resp = await this.editor.save();
      onChange(`${genPrefix()}${JSON.stringify(resp)}`);
    }, 500);

    this.editor = new EditorJS({
      /**
       * Id of Element that should contain Editor instance
       */
      holder: id,
      placeholder: "about...",
      onChange: (api: API, event: CustomEvent) => {
        console.log("EVENT ON CHANGE", api, event);
        this.debouncedSave();
      },

      tools: {
        header: Header,
      },
    });
  }

  setText(text: string) {
    const [header, content] = text.split(prefixSeparator);
    if (!content || content.length == 0) {
      //we do nothing
      return;
    }
    // try {
    const outData: OutputData = JSON.parse(content.trim());
    this.editor.render(outData);
    // } catch (e) {
    //   console.log("failed to get", e);
    // }
  }
}

export function createTextEditor({
  id,
  onChange,
  text,
}: TextEditorParams): TextEditor {
  const editor = new TextEditor({ id, onChange });
  editor.editor.isReady.then(async () => {
    text && editor.setText(text);
  });
  return editor;
}
