import { wrappingInputRule, Node } from '@tiptap/core';

import { AttributeType, BulletListNodeSpec, SetAttributeType } from 'common';

import { NoOptions, NoStorage } from 'notebookEditor/model/type';

import { setAttributeParsingBehavior, getNodeOutputSpec } from '../util/attribute';
import { safeParseTag } from '../util/parse';
import { toggleBulletListCommand } from './command';

// ********************************************************************************
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-bullet-list/src/bullet-list.ts

// == Node ========================================================================
export const BulletList = Node.create<NoOptions, NoStorage>({
  ...BulletListNodeSpec,

  // -- Attribute -----------------------------------------------------------------
  addAttributes() {
    return {
      ...this.parent?.(),

      // NOTE: This attribute is to ensure the ul gets displayed correctly. It is
      //       not (currently) meant to be editable by the user
      [AttributeType.MarginLeft]: setAttributeParsingBehavior(AttributeType.MarginLeft, SetAttributeType.STRING, '4px'),
    };
  },

  // -- Command -------------------------------------------------------------------
  addCommands() { return { toggleBulletList: toggleBulletListCommand }; },
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-8': () => this.editor.commands.toggleBulletList(),
      'Ctrl-Shift-8': () => this.editor.commands.toggleBulletList(),
    };
  },

  // -- Input ---------------------------------------------------------------------
  addInputRules() {
    return [
      wrappingInputRule({
        find: /^\s*([-+*])\s$/,
        type: this.type,
      }),
    ];
  },

  // -- View ----------------------------------------------------------------------
  // FIXME: Style attrs not getting applied to tag
  parseHTML() { return [safeParseTag('ul')]; },
  renderHTML({ node, HTMLAttributes }) { return getNodeOutputSpec(node, {/*no options*/ }, false/*not a leaf node*/); },
});
