import { Node } from '@tiptap/core';

import { AttributeType, NodeName, SetAttributeType, TaskListNodeSpec } from 'common';

import { NoOptions, NoStorage } from 'notebookEditor/model/type';

import { getNodeOutputSpec, setAttributeParsingBehavior } from '../util/attribute';
import { toggleTaskListCommand } from './command';

// ********************************************************************************
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-task-list/src/task-list.ts

// == Node ========================================================================
export const TaskList = Node.create<NoOptions, NoStorage>({
  ...TaskListNodeSpec,

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
  addCommands() { return { toggleTaskList: toggleTaskListCommand }; },
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-9': () => this.editor.commands.toggleTaskList(),
      'Ctrl-Shift-9': () => this.editor.commands.toggleTaskList(),
    };
  },

  // -- View ----------------------------------------------------------------------
  parseHTML() {
    return [
      {
        // FIXME: Not getting added to the rendered tag
        tag: `ul[data-type="${NodeName.TASK_LIST}"]`,
        priority: 51/*FIXME: Add and use parse rule priority enum */,
      },
    ];
  },
  // FIXME: Style attrs not getting applied to tag
  // FIXME: Add TaskListItem / see if it'll be needed once BulletList and OrderedList work again
  renderHTML({ node, HTMLAttributes }) { return getNodeOutputSpec(node, {/*no options*/}, false/*not a leaf node*/); },
});
