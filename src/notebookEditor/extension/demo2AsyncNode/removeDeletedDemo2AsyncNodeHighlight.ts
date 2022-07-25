import { Editor } from '@tiptap/core';
import { Transaction } from 'prosemirror-state';

import { NodeName } from 'common';

import { getRemovedNodesByTransaction } from '../util/node';
import { highlightReplacedTextKey, HighlightReplacedTextMeta } from './highlightReplacedText';

// ********************************************************************************
// == Constant ====================================================================
const demo2AsyncNodeSet = new Set<NodeName>([NodeName.DEMO2_ASYNCNODE]);

// ================================================================================
export const removeDeletedDemo2AsyncNodeHighlight = (editor: Editor, transaction: Transaction) => {
  if(transaction.doc === transaction.before) return/*no changes*/;

  const removedDemo2AsyncNodeObjs = getRemovedNodesByTransaction(transaction, demo2AsyncNodeSet);
  if(removedDemo2AsyncNodeObjs.length < 1) {
    return/*no demo2AsyncNodes were removed*/;
  } /* else -- at least one demo2AsyncNode was removed */

  // Remove decorations for removed demo2AsyncNodeObjs if they existed
  removedDemo2AsyncNodeObjs.forEach(removedObj => {
    editor.chain().command((props) => {
      const { dispatch, tr } = props;
      if(!dispatch) throw new Error('dispatch undefined when it should not');

      tr.setMeta(highlightReplacedTextKey/*(SEE: highlightReplacedText.ts)*/, {
        mapOperation: 'delete',
        highlightedNodeId: removedObj.node.attrs.id,
        from: 0/*ignored by plugin*/,
        to: 0/*ignored by plugin*/,
      } as HighlightReplacedTextMeta);
      dispatch(tr);
      return true;
    }).run();
  });
};
