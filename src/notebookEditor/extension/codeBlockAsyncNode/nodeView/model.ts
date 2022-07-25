import { Editor } from '@tiptap/core';

import { AttributeType, CodeBlockAsyncNodeType, isCodeBlockAsyncNode } from 'common';

import { AbstractAsyncNodeModel } from 'notebookEditor/extension/asyncNode/nodeView/model';
import { getCodeBlockViewStorage } from 'notebookEditor/extension/codeblock/nodeView/storage';
import { codeBlockHash, hashesFromCodeBlockReferences } from 'notebookEditor/extension/codeBlockAsyncNode/util';
import { findLastNodeByID, getPosType } from 'notebookEditor/extension/util/node';

import { AbstractCodeBlockAsyncNodeStorageType } from './controller';

// ********************************************************************************
export abstract class AbstractCodeBlockAsyncNodeModel

  // .. AbstractCodeBlockAsyncNodeModel Generics ....................................
  <T/*value returned by the async function*/,
  NodeType extends CodeBlockAsyncNodeType,
  Storage extends AbstractCodeBlockAsyncNodeStorageType>

  // .. AbstractAsyncNodeModel Generics ...........................................
  extends AbstractAsyncNodeModel<T, NodeType, Storage> {

  // == Lifecycle =================================================================
  public constructor(editor: Editor, node: NodeType, storage: Storage, getPos: getPosType) {
    super(editor, node, storage, getPos);
    // currently no additional behavior
  }

  // ================================================================================
  // all codeBlockAsyncNodes have the following functionality in common
  public async executeAsyncCall() {
    // NOTE: Hashes must be computed before the async call is executed, because the
    //       code blocks can change during the async call.
    const hashes = hashesFromCodeBlockReferences(this.editor, this.node.attrs.codeBlockReferences);
    const result = await this.createPromise();

    // if the Node that initiated the async call no longer exists by the time
    // the async call resolves, PM handles the removal of all of its view
    // components and syncs the Editor state. Hence the only thing that must
    // be done is to -not- make the replacement call by returning from the
    // executeAsyncCall that had been scheduled previously
    const existingNodeObj = findLastNodeByID(this.editor.state.doc, this.node.attrs.id);
    if(!existingNodeObj || !isCodeBlockAsyncNode(existingNodeObj.node)) {
      return false/*node view not updated*/;
    } /* else -- node still exists */

    // get the status based on the implementation of the AbstractAsyncNodeView
    const status = this.getStatusFromResult(result);
    const node = existingNodeObj.node.copy() as CodeBlockAsyncNodeType/*guaranteed by above check*/;
          node.attrs[AttributeType.CodeBlockHashes] = hashes;
          node.attrs[AttributeType.Status] = status;
          node.attrs[AttributeType.Text] = result;

    const viewWasUpdated = this.replaceCodeBlockAsyncNode(this.editor, node, existingNodeObj.position);
    return viewWasUpdated;
  }

  // All codeBlockAsyncNodes share this logic for checking if they are dirty
  // (SEE: checkDirty.ts)
  public isAsyncNodeDirty() {
    const { codeBlockReferences, codeBlockHashes } = this.node.attrs,
          codeBlockViewStorage = getCodeBlockViewStorage(this.editor);
    let isDirty = false/*default*/;

    for(let j=0; j<codeBlockReferences.length; j++) {
      const referencedCodeBlockView = codeBlockViewStorage.getNodeView(codeBlockReferences[j]);

      // -- check that codeBlock exists -----------------------------------------
      if(!referencedCodeBlockView) {
        isDirty = true/*reference no longer exists*/;
        break/*nothing else to check*/;
      }/* else -- reference still exists */

      // -- check that hash matches ---------------------------------------------
      if(codeBlockHash(referencedCodeBlockView.node) !== codeBlockHashes[j]) {
        isDirty = true/*order of hashes is different or content changed*/;
        break/*nothing else to check*/;
      }/* else -- hash matches, node is not dirty */
    }

    return isDirty;
  }

  // ================================================================================
  /**
   * replace either either the content of the codeBlockAsyncNode or the whole
   * itself depending on the needs of the specific codeBlockAsyncNode
   *
   * @param editor The current {@link Editor} document
   * @param node The new codeBlockAsyncNode that will replace the current one
   * @param position The position of the codeBlockAsyncNode that will be replaced
   */
  protected abstract replaceCodeBlockAsyncNode(editor: Editor, node: CodeBlockAsyncNodeType, position: number): boolean;

}
