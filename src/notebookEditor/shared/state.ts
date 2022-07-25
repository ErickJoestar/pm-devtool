import { Editor } from '@tiptap/core';
import { Node as ProseMirrorNode } from 'prosemirror-model';

import { codeBlockLevel, isCodeBlockNode, isHeadingNode, updateStack, AttributeType, CodeBlockRendererState, NotebookSchemaType, RendererState, NodeName } from 'common';

// FIXME: Find a better approach to shared this with common.
// ********************************************************************************
// performs a depth-first search of all nodes in order to compute the visual
// for all the Nodes present in the document.
export const computeState = (editor: Editor): RendererState => {
  const codeBlockState: CodeBlockRendererState = {
    visualIds: {},
    stack: [],
  };
  const rendererState: RendererState = {
    [NodeName.CODEBLOCK]: codeBlockState,
  };

  // determine the headings before the specified code block using a depth-first search
  // REF: https://en.wikipedia.org/wiki/Depth-first_search
  const incorporateNode = (node: ProseMirrorNode<NotebookSchemaType>): boolean/*false when done traversing*/ => {
    if(isCodeBlockNode(node) && node.attrs) {
      updateStack(codeBlockLevel/*by definition*/, codeBlockState);

      // compute the id as a string
      codeBlockState.visualIds[node.attrs[AttributeType.Id]] = codeBlockState.stack.map(({ value }) => value).join('.');
    } else if(isHeadingNode(node)) {
      updateStack(node.attrs.level, codeBlockState);
    } /* else -- not a heading or code block node */

    if(node.isLeaf) return true/*keep searching (but nothing else to do)*/;

    // traverse all of its children
    const childCount = node.childCount;
    for(let i=0; i<childCount; i++) {
      if(!incorporateNode(node.child(i))) return false/*done traversing*/;
    }

    return true/*nothing found but keep traversing*/;
  };

  // traverse every node on the document in a DFS order to generate the visualId
  incorporateNode(editor.state.doc);

  return rendererState;
};
