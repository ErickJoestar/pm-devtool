import { CommandProps } from '@tiptap/core';

import { NodeName } from 'common';

// ********************************************************************************
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    [NodeName.TASK_LIST]: {
      /** Toggle a task list */
      toggleTaskList: () => ReturnType;
    };
  }
}

// --------------------------------------------------------------------------------
export const toggleTaskListCommand = () => ({ commands }: CommandProps) =>
  commands.toggleList(NodeName.TASK_LIST, NodeName.LIST_ITEM);
