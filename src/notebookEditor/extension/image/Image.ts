import { Node } from '@tiptap/core';

import { defaultParseIMGTag, AttributeType, ImageNodeSpec, SetAttributeType } from 'common';
import { DialogStorage } from 'notebookEditor/model/DialogStorage';
import { NoOptions } from 'notebookEditor/model/type';

import { getNodeOutputSpec, setAttributeParsingBehavior } from '../util/attribute';
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
  renderHTML({ node, HTMLAttributes }) { return getNodeOutputSpec(node, HTMLAttributes); },
});
