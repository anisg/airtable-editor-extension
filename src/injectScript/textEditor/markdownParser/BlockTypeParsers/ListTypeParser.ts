import { BlockContent, DefinitionContent, List } from "mdast";
import { buildTextFromChildrenBlocks } from "./ParagraphTypeParser";

export function parseListToMarkdown(blocks) {
  let items = {};
  switch (blocks.style) {
    case "unordered": {
      return `${blocks.items.map((item) => `- ${item}`).join("\n")}\n`;
    }
    case "ordered": {
      return `${blocks.items
        .map((item, index) => `${index + 1}. ${item}`)
        .join("\n")}\n`;
    }
    default:
      break;
  }
}

export function parseMarkdownToList(blocks: List) {
  let listData = {};
  const itemData = [];

  blocks.children.forEach((items) => {
    items.children.forEach((listItem: any) => {
      const text = buildTextFromChildrenBlocks(listItem.children);
      itemData.push(text);
    });
  });

  listData = {
    data: {
      items: itemData,
      style: blocks.ordered ? "ordered" : "unordered",
    },
    type: "list",
  };

  return listData;
}
