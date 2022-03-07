import { println } from "../../utils";
import { OutputData } from "../types";
import { parseCheckboxToMarkdown } from "./BlockTypeParsers/CheckboxTypeParser";
import { parseCodeToMarkdown } from "./BlockTypeParsers/CodeTypeParser";
import { parseDelimiterToMarkdown } from "./BlockTypeParsers/DelimiterTypeParser";
import { parseHeaderToMarkdown } from "./BlockTypeParsers/HeaderTypeParser";
import { parseImageToMarkdown } from "./BlockTypeParsers/ImageTypeParser";
import { parseListToMarkdown } from "./BlockTypeParsers/ListTypeParser";
import { parseParagraphToMarkdown } from "./BlockTypeParsers/ParagraphTypeParser";
import { parseQuoteToMarkdown } from "./BlockTypeParsers/QuoteTypeParser";

export function editorJsDataToMarkdownStr(data: OutputData) {
  const initialData: any = {};

  initialData.content = data.blocks;
  println("editorJs -> markdown");
  println("data", data);

  const parsedData = initialData.content.map((item) => {
    // iterate through editor data and parse the single blocks to markdown syntax
    switch (item.type) {
      case "header":
        return parseHeaderToMarkdown(item.data);
      case "paragraph":
        return parseParagraphToMarkdown(item.data);
      case "list":
        return parseListToMarkdown(item.data);
      case "delimiter":
        return parseDelimiterToMarkdown();
      case "image":
        return parseImageToMarkdown(item.data);
      case "quote":
        return parseQuoteToMarkdown(item.data);
      case "checkbox":
        return parseCheckboxToMarkdown(item.data);
      case "code":
        return parseCodeToMarkdown(item.data);
      case "checklist":
        return parseCheckboxToMarkdown(item.data);
      default:
        break;
    }
  });

  // take parsed data and create a markdown file
  const resp = parsedData.join("\n");
  println("resp->", resp);
  return resp;
}
