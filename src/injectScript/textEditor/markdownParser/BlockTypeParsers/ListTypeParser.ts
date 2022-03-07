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

export function parseMarkdownToList(blocks) {
  let listData = {};
  const itemData = [];

  blocks.children.forEach((items) => {
    items.children.forEach((listItem) => {
      listItem.children.forEach((listEntry) => {
        itemData.push(listEntry.value);
      });
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
