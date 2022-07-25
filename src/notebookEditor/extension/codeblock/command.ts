import { CommandProps } from '@tiptap/core';

import { NodeName } from 'common';

import { parentIsOfType, toggleBlockNode } from 'notebookEditor/extension/util/node';
import { CommandFunctionType } from 'notebookEditor/extension/util/type';

// ********************************************************************************
// == Type ========================================================================
// NOTE: Usage of ambient module to ensure command is TypeScript-registered
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    [NodeName.CODEBLOCK/*Expected and guaranteed to be unique. (SEE: /notebookEditor/model/node)*/]: {
      /** Toggle a code block */
      toggleCodeBlock:  CommandFunctionType<typeof toggleCodeBlockCommand, ReturnType>;
    };
  }
}

// --------------------------------------------------------------------------------
export const toggleCodeBlockCommand = () => (commandProps: CommandProps) => {
  if(parentIsOfType(commandProps.editor.state.selection, NodeName.CODEBLOCK)) {
    return false/*do not allow codeBlocks to be toggable*/;
  }/* else -- create a codeBlock */

  return toggleBlockNode(commandProps, NodeName.CODEBLOCK);
};

