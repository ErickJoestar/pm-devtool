import { CommandProps } from '@tiptap/core';
import { Node as ProseMirrorNode } from 'prosemirror-model';

import { createDefaultDemoAsyncNodeAttributes, DemoAsyncNodeAttributes, NotebookSchemaType, NodeName } from 'common';

import { replaceAndSelectNode, selectionIsOfType } from 'notebookEditor/extension/util/node';
import { CommandFunctionType } from 'notebookEditor/extension/util/type';

// == Type ========================================================================
// NOTE: Usage of ambient module to ensure command is TypeScript-registered
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    [NodeName.DEMO_ASYNCNODE/*Expected and guaranteed to be unique. (SEE: /notebookEditor/model/node)*/]: {
      /** Insert and select a Demo Async Node */
      insertDemoAsyncNode: CommandFunctionType<typeof insertAndSelectDemoAsyncNode, ReturnType>;
    };
  }
}
// == Implementation ==============================================================
// .. Create ......................................................................
const createDemoAsyncNode = (schema: NotebookSchemaType, attributes: DemoAsyncNodeAttributes): ProseMirrorNode<NotebookSchemaType> =>
    schema.nodes[NodeName.DEMO_ASYNCNODE].create(attributes);

// .. Insert ......................................................................
export const insertAndSelectDemoAsyncNode = () => (props: CommandProps) => {
  if(selectionIsOfType(props.editor.state.selection, NodeName.DEMO_ASYNCNODE)) return false/*ignore if selected node already is a demo async node*/;

  const demoAsyncNode = createDemoAsyncNode(props.editor.schema, createDefaultDemoAsyncNodeAttributes());
  return replaceAndSelectNode(demoAsyncNode, props.tr, props.dispatch);
};
