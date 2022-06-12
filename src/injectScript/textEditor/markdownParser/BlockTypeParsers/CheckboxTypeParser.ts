import { List } from "mdast";
import { buildTextFromChildrenBlocks } from "./ParagraphTypeParser";

export function parseCheckboxToMarkdown(blocks) {
  let items = [];

  console.log("blocks", blocks);
  items = blocks.items.map((item) => {
    if (item.checked === true) {
      return `- [X] ${item.text}`;
    }
    return `- [ ] ${item.text}`;
  });

  return items.join("\n");
}

export function isCheckboxList(blocks) {
  const firstListItem = blocks.children[0]?.children[0];
  const firstListItemParagraph = firstListItem?.children[0];
  console.log("firstListItemParagraph", firstListItemParagraph);
  const firstListItemText = firstListItemParagraph?.value;
  return (
    firstListItemText &&
    (firstListItemText.startsWith("[ ] ") ||
      firstListItemText.startsWith("[X] ") ||
      firstListItemText.startsWith("[x] "))
  );
}

function valueWithoutCheckbox(s: string) {
  return s.match(/\[(?:\s|X|x)\] (.*)/)[1];
}

function isChecked(s: string) {
  return s.startsWith("[ ] ") ? false : true;
}

function _parseMarkdownToChecklist(blocks: List) {
  let listData = {};
  const itemData = [];

  blocks.children.forEach((items) => {
    items.children.forEach((listItem: any) => {
      const text = buildTextFromChildrenBlocks(listItem.children);
      itemData.push({
        text: valueWithoutCheckbox(text),
        checked: isChecked(text),
      });
    });
  });

  listData = {
    data: {
      items: itemData,
    },
    type: "checklist",
  };

  return listData;
}

export function parseMarkdownToChecklist(blocks: List) {
  return _parseMarkdownToChecklist(blocks);
}
