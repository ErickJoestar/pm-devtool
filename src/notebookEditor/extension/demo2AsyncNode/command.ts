import { CommandProps } from '@tiptap/core';

import { NodeName } from 'common';

import { parentIsOfType, toggleBlockNode } from 'notebookEditor/extension/util/node';
import { CommandFunctionType } from 'notebookEditor/extension/util/type';

// == Type ========================================================================
// NOTE: Usage of ambient module to ensure command is TypeScript-registered
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    [NodeName.DEMO2_ASYNCNODE/*Expected and guaranteed to be unique. (SEE: /notebookEditor/model/node)*/]: {
      /** Insert and select a Demo2 Async Node */
      toggleDemo2AsyncNode: CommandFunctionType<typeof toggleDemo2AsyncNodeCommand, ReturnType>;
    };
  }
}
// == Implementation ==============================================================
export const toggleDemo2AsyncNodeCommand = () => (commandProps: CommandProps) => {
  if(parentIsOfType(commandProps.editor.state.selection, NodeName.DEMO2_ASYNCNODE)) {
    return false/*do not allow demo2AsyncNodes to be toggable*/;
  }/* else -- create a demo2AsyncNode */

  return toggleBlockNode(commandProps, NodeName.DEMO2_ASYNCNODE);
};
