import { wrappingInputRule, Node } from '@tiptap/core';

import { AttributeType, OrderedListNodeSpec, SetAttributeType, ORDERED_LIST_DEFAULT_START } from 'common';

import { NoOptions, NoStorage } from 'notebookEditor/model/type';

import { getNodeOutputSpec, setAttributeParsingBehavior } from '../util/attribute';
import { safeParseTag } from '../util/parse';
import { toggleOrderedListCommand } from './command';

// ********************************************************************************
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-ordered-list/src/ordered-list.ts

// == Node ========================================================================
export const OrderedList = Node.create<NoOptions, NoStorage>({
  ...OrderedListNodeSpec,

  // -- Attribute -----------------------------------------------------------------
  addAttributes() {
    return {
      ...this.parent?.(),
      // NOTE: Must be named 'start' since thats the name of the 'ol' HTML tag attribute
      [AttributeType.Start]: setAttributeParsingBehavior(AttributeType.Start, SetAttributeType.NUMBER, ORDERED_LIST_DEFAULT_START),

      // NOTE: This attribute is to ensure the ul gets displayed correctly. It is
      //       not (currently) meant to be editable by the user
      [AttributeType.MarginLeft]: setAttributeParsingBehavior(AttributeType.MarginLeft, SetAttributeType.STRING, '4px'),
    };
  },

  // -- Command -------------------------------------------------------------------
  addCommands() { return { toggleOrderedList: toggleOrderedListCommand }; },
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-7': () => this.editor.commands.toggleOrderedList(),
      'Ctrl-Shift-7': () => this.editor.commands.toggleOrderedList(),
    };
  },

  // -- Input ---------------------------------------------------------------------
  // Create an OrderedList node if the user types a number followed by a dot, and
  // then an enter or a space
  addInputRules() {
    return [
      wrappingInputRule({
        find: /^(\d+)\.\s$/,
        type: this.type,
        getAttributes: match => ({ start: +match[1] }),
        joinPredicate: (match, node) => node.childCount + node.attrs.start === +match[1],
      }),
    ];
  },

  // -- View ----------------------------------------------------------------------
  parseHTML() { return [safeParseTag('ol')]; },
  renderHTML({ node, HTMLAttributes }) {
  // FIXME: Style attrs not getting applied to tag
    const { start /*...attributesWithoutStart*/ } = HTMLAttributes;
    // if there is a start present (e.g. typing '9.'), do not use the default
    // start when copying / pasting (ensuring that '9.' gets used instead)
    return start === ORDERED_LIST_DEFAULT_START
      ? getNodeOutputSpec(node, {/*no options*/}, false/*not a leaf node*/)
      : getNodeOutputSpec(node, {/*no options*/}, false/*not a leaf node*/);
  },
});
