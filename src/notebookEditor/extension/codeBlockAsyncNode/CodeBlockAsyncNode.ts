import { Extension } from '@tiptap/core';

import { ExtensionName, ExtensionPriority, NoOptions, NoStorage } from 'notebookEditor/model/type';

import { removeDeletedReferences } from './removeDeletedReferences';

// ********************************************************************************
// NOTE: CodeBlockAsyncNodes are meant to be an abstraction for all async nodes
//       whose behavior relates to codeBlocks. As such, any functionality that
//       is common to all of them is implemented here.
// NOTE: All common attributes shared across codeBlockAsyncNodes are defined in its
//       corresponding common file
//       (SEE: src/common/notebookEditor/extension/codeBlockAsyncNode.ts)

// == Extension ===================================================================
export const CodeBlockAsyncNode = Extension.create<NoOptions, NoStorage>({
  name: ExtensionName.CODEBLOCK_ASYNC_NODE,
  priority: ExtensionPriority.CODEBLOCK_ASYNC_NODE,

  // -- Transaction ---------------------------------------------------------------
  onTransaction({ transaction }) {
    // check if any CodeBlock references got deleted and if they did, remove them
    // from the codeBlockReferences array of any async nodes listening to them
    removeDeletedReferences(transaction, this.editor);
  },
});
