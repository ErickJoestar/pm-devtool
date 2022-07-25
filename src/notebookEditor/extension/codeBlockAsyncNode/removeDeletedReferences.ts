import { Editor } from '@tiptap/core';
import { Transaction } from 'prosemirror-state';

import { codeBlockAsyncNodes, NodeName } from 'common';

import { getNodeViewStorage } from 'notebookEditor/model/NodeViewStorage';

import { getRemovedNodesByTransaction, NodeFound } from '../util/node';
import { HISTORY_META } from '../history/History';
import { AbstractAsyncNodeStorageType } from '../asyncNode/nodeView/controller';

// ********************************************************************************
// == Constant ====================================================================
const codeBlockSet = new Set<NodeName>([NodeName.CODEBLOCK]);

// ================================================================================
export const removeDeletedReferences = (transaction: Transaction, editor: Editor) => {
  if(transaction.doc === transaction.before) return/*no changes*/;

  const removedCodeBlockObjs = getRemovedNodesByTransaction(transaction, codeBlockSet);
  if(removedCodeBlockObjs.length < 1) {
    return/*no CodeBlocks were removed*/;
  } /* else -- at least one codeBlock was removed */

  updateAsyncNodeReferences(editor, removedCodeBlockObjs);
};

/**
 * Goes through each AsyncNodeStorage and updates the codeBlockReferences of
 * its AsyncNodes if any of them were deleted in the transaction
 *
 * NOTE: iterating through the storages is cheaper than going through the document
 */
const updateAsyncNodeReferences = (editor: Editor, removedCodeBlockObjs: NodeFound[]) => {
  const removedCodeBlockIds = new Set<string>(removedCodeBlockObjs.map(obj => obj.node.attrs.id));

  // for each AsyncNode storage, check if each AsyncNode in its asyncNodeViewMap
  // is listening to any of the codeBlockIDs that were removed, and if so then
  // remove it from its codeBlockReferences array
  codeBlockAsyncNodes.forEach(asyncNodeName => {
    const storage = getNodeViewStorage<AbstractAsyncNodeStorageType>(editor, asyncNodeName);

    storage.forEachNodeView(asyncNodeView => {
      const { codeBlockReferences } = asyncNodeView.node.attrs;

      let shouldUpdateReferences = false/*initial value*/;
      for(let i=0; i<codeBlockReferences.length; i++) {
        if(removedCodeBlockObjs.some(removedCodeBlockObj => removedCodeBlockObj.node.attrs.id === codeBlockReferences[i])) {
          shouldUpdateReferences = true/*references must be updated*/;
        } /* else -- reference not included, no need to update async node */

        if(shouldUpdateReferences) break/*already know references must be updated*/;
      }
      if(!shouldUpdateReferences) return/*nothing to do, check next node*/;

      const newReferences = [...codeBlockReferences].filter(codeBlockReference => !removedCodeBlockIds.has(codeBlockReference));

      // NOTE: must be dispatched through a 'command' Editor Command, otherwise an
      //       'applying mismatched transaction' error is thrown
      //       (i.e. updateAttributes or the like cannot be used to update the node)
      editor.chain().command((props) => {
        const { dispatch, tr } = props;
        if(!dispatch) throw new Error('dispatch is undefined when it should not be');

        // FIXME: The set history meta is currently preventing the transaction
        //        that removes the reference from being added to the history.
        //        However, this is can be wrong if the user undoes and expects
        //        the tag to be added again. This happens cause two transactions
        //        are dispatched (delete the codeblock, then its reference
        //        in async nodes). The solution is to use an appendedTransaction,
        //        but since appendedTransactions run before onTransactions
        //        and TipTap gets updated, it would have to iterate through the
        //        doc and find async nodes that listen to the codeBlock (since storage
        //        would have non-up-to-date values). Another alternative is to change
        //        the UX regarding the 'should an user be responsible for removing
        //        the deleted references', in which case other things
        //        (e.g. ExecuteAsyncNodeButton, ChipTool behavior) must change too
        tr
        .setNodeMarkup(asyncNodeView.getPos(), undefined/*maintain type*/, { ...asyncNodeView.node.attrs, codeBlockReferences: newReferences }/*set to the new codeBlockReferences*/)
        .setMeta(HISTORY_META, false);
        return true/*async node updated*/;
      }).run();
    });
  });
};
