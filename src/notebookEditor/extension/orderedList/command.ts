import { CommandProps } from '@tiptap/core';

import { NodeName } from 'common';

// ********************************************************************************
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    [NodeName.ORDERED_LIST]: {
      /** Toggle an ordered list */
      toggleOrderedList: () => ReturnType;
    };
  }
}

// --------------------------------------------------------------------------------
export const toggleOrderedListCommand = () => ({ commands }: CommandProps) =>
  commands.toggleList(NodeName.ORDERED_LIST, NodeName.LIST_ITEM);
