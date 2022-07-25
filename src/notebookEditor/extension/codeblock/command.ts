import { CommandProps } from '@tiptap/core';

import { NodeName } from 'common';

import { toggleBlockNode } from 'notebookEditor/extension/util/node';
import { CommandFunctionType } from 'notebookEditor/extension/util/type';

// ********************************************************************************
// == Type ========================================================================
// NOTE: Usage of ambient module to ensure command is TypeScript-registered
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    [NodeName.CODEBLOCK/*Expected and guaranteed to be unique. (SEE: /notebookEditor/model/node)*/]: {
      /** Toggle a code block */
      toggleCodeBlock:  CommandFunctionType<typeof toggleBlockNodeCommand, ReturnType>;
    };
  }
}

// --------------------------------------------------------------------------------
export const toggleBlockNodeCommand = () => (commandProps: CommandProps) => toggleBlockNode(commandProps, NodeName.CODEBLOCK);
