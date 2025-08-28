import { Element, Text } from 'hast';
import { visit } from 'unist-util-visit';
import { QuartzTransformerPlugin } from "./types";

const renameFootnotesHeading: QuartzTransformerPlugin = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'h2' &&
        node.children.length > 0 &&
        node.children[0].type === 'text' // narrow to Text
      ) {
        const textNode = node.children[0] as Text;
        if (textNode.value === 'Footnotes') {
          textNode.value = 'References';
        }
      }
    });
  };
};

export default renameFootnotesHeading;