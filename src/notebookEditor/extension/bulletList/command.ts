import { CommandProps } from '@tiptap/core';

import { NodeName } from 'common';

// ********************************************************************************
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    [NodeName.BULLET_LIST]: {
      /** Toggle a bullet list */
      toggleBulletList: () => ReturnType;
    };
  }
}

// --------------------------------------------------------------------------------
export const toggleBulletListCommand = () => ({ commands }: CommandProps) =>
  commands.toggleList(NodeName.BULLET_LIST, NodeName.LIST_ITEM);
