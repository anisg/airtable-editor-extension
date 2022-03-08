import * as remark from "remark";
import { parseMarkdownToHeader } from "./BlockTypeParsers/HeaderTypeParser";
import { parseMarkdownToParagraph } from "./BlockTypeParsers/ParagraphTypeParser";
import { parseMarkdownToList } from "./BlockTypeParsers/ListTypeParser";
import { parseMarkdownToDelimiter } from "./BlockTypeParsers/DelimiterTypeParser";
import { parseMarkdownToCode } from "./BlockTypeParsers/CodeTypeParser";
import { parseMarkdownToQuote } from "./BlockTypeParsers/QuoteTypeParser";
import { println } from "../../utils";
import {
  isCheckboxList,
  parseMarkdownToChecklist,
} from "./BlockTypeParsers/CheckboxTypeParser";

export function markdownStrToEditorJsData(content: string) {
  const blocks = [];
  const parsedMarkdown = remark.remark().parse(content);
  // iterating over the pared remarkjs syntax tree and executing the json parsers
  println(`markdown -> editorjs`);
  println(content);
  println("parsedMarkdown", parsedMarkdown);
  parsedMarkdown.children.forEach((item) => {
    switch (item.type) {
      case "heading":
        return blocks.push(parseMarkdownToHeader(item));
      case "paragraph":
        return blocks.push(parseMarkdownToParagraph(item));
      case "list":
        if (isCheckboxList(item)) {
          return blocks.push(parseMarkdownToChecklist(item));
        }
        return blocks.push(parseMarkdownToList(item));
      case "thematicBreak":
        return blocks.push(parseMarkdownToDelimiter());
      case "code":
        return blocks.push(parseMarkdownToCode(item));
      case "blockquote":
        return blocks.push(parseMarkdownToQuote(item));
      default:
        break;
    }
  });
  const outputData = {
    blocks: blocks.filter((value) => Object.keys(value).length !== 0),
  };
  if (outputData.blocks.length === 0) return null;
  return outputData;
}
