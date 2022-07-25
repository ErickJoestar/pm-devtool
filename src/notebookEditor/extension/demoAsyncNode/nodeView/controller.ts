import { Editor } from '@tiptap/core';

import { DemoAsyncNodeType } from 'common';

import { AbstractCodeBlockAsyncNodeController } from 'notebookEditor/extension/codeBlockAsyncNode/nodeView/controller';
import { getPosType } from 'notebookEditor/extension/util/node';
import { NodeViewStorage } from 'notebookEditor/model/NodeViewStorage';

import { DemoAsyncNodeModel } from './model';
import { DemoAsyncNodeView } from './view';

// ********************************************************************************
export type DemoAsyncNodeStorageType = NodeViewStorage<DemoAsyncNodeController>
export class DemoAsyncNodeController extends AbstractCodeBlockAsyncNodeController<string, DemoAsyncNodeType, DemoAsyncNodeStorageType, DemoAsyncNodeModel, DemoAsyncNodeView> {
  // == Life-cycle ================================================================
  public constructor(editor: Editor, node: DemoAsyncNodeType, storage: DemoAsyncNodeStorageType, getPos: getPosType) {
    const model = new DemoAsyncNodeModel(editor, node, storage, getPos),
          view = new DemoAsyncNodeView(model, editor, node, storage, getPos);

    super(model, view, editor, node, storage, getPos);
  }

  // .. Mutation ..................................................................
  /**
   * Ignore mutations that modify the childList of the Nodes within this view.
   * This happens when explicitly modifying HTML of the view.
   * @see NodeView#ignoreMutation()
   * @see #updateVisualID()
   */
   public ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Element; }) {
    // ignore if modifying the childList of the nodes within this view
    return (mutation.type === 'childList') || (mutation.type === 'attributes');
  }
}
