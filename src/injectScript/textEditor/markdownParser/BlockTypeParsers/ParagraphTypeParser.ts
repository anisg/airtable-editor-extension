export function parseParagraphToMarkdown(blocks) {
  return `${blocks.text}\n`;
}

type TextBlock = { position: any; type: "text"; value: string };
type HtmlBlock = { position: any; type: "html"; value: string };

function buildTextFromChildrenBlocks(
  blocks: (TextBlock | HtmlBlock)[]
): string {
  return blocks.map((block) => block.value).join("");
}

export function parseMarkdownToParagraph(blocks) {
  let imageBlock = null;
  if ((imageBlock = blocks.children.find((block) => block.type === "image"))) {
    return {
      data: {
        caption: imageBlock.title,
        stretched: false,
        url: imageBlock.url,
        withBackground: false,
        withBorder: false,
      },
      type: "image",
    };
  }
  return {
    data: {
      text: buildTextFromChildrenBlocks(blocks.children),
    },
    type: "paragraph",
  };
}
