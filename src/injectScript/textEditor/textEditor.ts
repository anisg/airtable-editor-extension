import { debounceImmediate, println, sleep } from "../utils";
import IEditorJS, { API, OutputData } from "./types";
const Undo = require("editorjs-undo");
const DragDrop = require("editorjs-drag-drop");
const EditorJS = require("./editor");
const Header = require("@editorjs/header");
const SimpleImage = require("@editorjs/simple-image");
const List = require("@editorjs/list");
const Checklist = require("@editorjs/checklist");
const Marker = require("@editorjs/marker");
const InlineCode = require("@editorjs/inline-code");
const CodeTool = require("@editorjs/code");

const prefixSeparator =
  "------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------";
const genPrefix = () => `${prefixSeparator}`;

function getEditorJsDataFromText(text?: string): OutputData {
  if (!text) return null;
  const [header, content] = text.split(prefixSeparator);
  if (!content || content.length == 0) {
    //we do nothing
    return null;
  }

  const outData: OutputData = JSON.parse(content.trim());
  if (outData.blocks.length === 0) return null;
  return outData;
  // if (outData.blocks.length === 0) {
  //   this.editor.render({
  //     ...outData,
  //     blocks: [{ id: "Ez1b6CwM8T", type: "paragraph", data: { text: "" } }],
  //   });
  // } else {
}

type TextEditorParams = {
  id: string;
  onChange: (text: string) => any;
  text?: string;
};
class TextEditor {
  debouncedSave: ReturnType<typeof debounceImmediate>;
  editor: IEditorJS;

  constructor({ id, onChange, text }: TextEditorParams) {
    this.debouncedSave = debounceImmediate(async () => {
      println("called onSaveSync!");
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
        println("EVENT ON CHANGE", api, event);
        this.debouncedSave();
      },
      logLevel: "ERROR",
      onReady: () => {
        new Undo({ editor: this.editor });
        new DragDrop(this.editor);
      },
      data: getEditorJsDataFromText(text),
      tools: {
        header: Header,
        image: SimpleImage,
        marker: {
          class: Marker,
          shortcut: "CMD+SHIFT+M",
        },
        inlineCode: {
          class: InlineCode,
          shortcut: "CMD+SHIFT+L",
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        code: CodeTool,
      },
    });
  }

  setText(text: string) {
    // }
    // } catch (e) {
    //   console.log("failed to get", e);
    // }
    this.editor.render(getEditorJsDataFromText(text));
  }
}

export function createTextEditor({
  id,
  onChange,
  text,
}: TextEditorParams): TextEditor {
  const editor = new TextEditor({ id, onChange, text });
  editor.editor.isReady.then(async () => {});
  return editor;
}
