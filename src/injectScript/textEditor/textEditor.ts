import { debounceImmediate, println, sleep } from "../utils";
import { editorJsDataToMarkdownStr } from "./markdownParser/editorJsDataToMarkdownStr";
import { markdownStrToEditorJsData } from "./markdownParser/markdownStrToEditorJsData";
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
      const outputData = await this.editor.save();
      const mdContent = editorJsDataToMarkdownStr(outputData);
      onChange(mdContent);
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
      data: markdownStrToEditorJsData(text),
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
    this.editor.render(markdownStrToEditorJsData(text));
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
