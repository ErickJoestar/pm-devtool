import { mergeAttributes, Node } from '@tiptap/core';

import { defaultIMGTag, defaultParseIMGTag, isStyleAttribute, snakeCaseToKebabCase, AttributeType, ImageNodeSpec, SetAttributeType } from 'common';
import { DialogStorage } from 'notebookEditor/model/DialogStorage';
import { NoOptions } from 'notebookEditor/model/type';
import { INLINE_NODE_CONTAINER_CLASS } from 'notebookEditor/theme/theme';

import { setAttributeParsingBehavior } from '../util/attribute';
import { nodeToTagID } from '../util/node';
import { insertAndSelectImage } from './command';
import { imagePaste } from './imagePaste';

// ********************************************************************************
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-image/src/image.ts

// == Node ========================================================================
export const Image = Node.create<NoOptions, DialogStorage>({
  ...ImageNodeSpec,

  // -- Attribute -----------------------------------------------------------------
  addAttributes() {
    return {
      [AttributeType.Src]: setAttributeParsingBehavior(AttributeType.Src, SetAttributeType.STRING),
      [AttributeType.Alt]: setAttributeParsingBehavior(AttributeType.Alt, SetAttributeType.STRING),
      [AttributeType.Title]: setAttributeParsingBehavior(AttributeType.Title, SetAttributeType.STRING),

      [AttributeType.Width]: setAttributeParsingBehavior(AttributeType.Width, SetAttributeType.NUMBER),
      [AttributeType.Height]: setAttributeParsingBehavior(AttributeType.Height, SetAttributeType.NUMBER),
      [AttributeType.TextAlign]: setAttributeParsingBehavior(AttributeType.TextAlign, SetAttributeType.STRING),
      [AttributeType.VerticalAlign]: setAttributeParsingBehavior(AttributeType.VerticalAlign, SetAttributeType.STRING),
    };
  },

  // -- Command -------------------------------------------------------------------
  addCommands() { return { insertImage: (attrs) => (commandProps) => insertAndSelectImage(commandProps, attrs) }; },

  // -- Plugin --------------------------------------------------------------------
  addProseMirrorPlugins() { return [imagePaste(this.editor)]; },

  // -- Storage -------------------------------------------------------------------
  addStorage() { return new DialogStorage(); },

  // -- View ----------------------------------------------------------------------
  parseHTML() { return [{ tag: defaultParseIMGTag }]; },
  renderHTML({ node, HTMLAttributes }) { return [ defaultIMGTag, mergeAttributes(HTMLAttributes/*add attrs to pasted html*/, { id: nodeToTagID(node)/*used by plugin*/, class: INLINE_NODE_CONTAINER_CLASS/*inline required*/, contentEditable: 'false'/*inline required*/, style: getCSSStyleFromAttributes(HTMLAttributes) }) ]; },
});

// TODO: Use getOutputSpec instead of this
const getCSSStyleFromAttributes = (attributes: Record<string, any>) => {
  // get all "pair:value;" from the specified attributes and merge them in a string
  const properties = Object.keys(attributes).filter(isStyleAttribute);
  const stylesString = properties.reduce((acc, property) => {
    const value = attributes[property];
    if(!value) return acc/*nothing to parse*/;
    const kebabCase = snakeCaseToKebabCase(property);
    const parsed = `${kebabCase}:${value};`;
    return `${acc}${parsed}`;
  }, '');
  return stylesString;
};
