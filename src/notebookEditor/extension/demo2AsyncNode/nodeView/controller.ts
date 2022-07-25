import { Editor } from '@tiptap/core';

import { Demo2AsyncNodeType } from 'common';

import { AbstractAsyncNodeController } from 'notebookEditor/extension/asyncNode/nodeView/controller';
import { getPosType } from 'notebookEditor/extension/util/node';
import { NodeViewStorage } from 'notebookEditor/model/NodeViewStorage';

import { Demo2AsyncNodeModel } from './model';
import { Demo2AsyncNodeView } from './view';

// ********************************************************************************
export type Demo2AsyncNodeStorageType = NodeViewStorage<Demo2AsyncNodeController>;
export class Demo2AsyncNodeController extends AbstractAsyncNodeController<string, Demo2AsyncNodeType, Demo2AsyncNodeStorageType, Demo2AsyncNodeModel, Demo2AsyncNodeView> {
  // == Life-cycle ================================================================
  public constructor(editor: Editor, node: Demo2AsyncNodeType, storage: Demo2AsyncNodeStorageType, getPos: getPosType) {
    const model = new Demo2AsyncNodeModel(editor, node, storage, getPos),
          view = new Demo2AsyncNodeView(model, editor, node, storage, getPos);
    super(model, view, editor, node, storage, getPos);
  }

  // == ProseMirror Methods =======================================================
  // -- Selection -----------------------------------------------------------------
  public ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Element; }) {
    return (mutation.type === 'childList' || mutation.type === 'attributes')/*current view element modification*/;
  }
}
