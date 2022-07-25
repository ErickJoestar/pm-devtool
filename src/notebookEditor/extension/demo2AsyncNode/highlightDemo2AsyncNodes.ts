import { Editor } from '@tiptap/core';
import { Transaction } from 'prosemirror-state';

import { NotebookSchemaType, NodeName } from 'common';

import { getNodeViewStorage } from 'notebookEditor/model/NodeViewStorage';

import { HISTORY_META } from '../history/History';
import { wereNodesAffectedByTransaction } from '../util/node';
import { hashString } from '../util/parse';
import { getHighlightReplacedTextState, highlightReplacedTextKey, HighlightReplacedTextMeta } from './highlightReplacedText';

// ********************************************************************************
// == Constant ====================================================================
const demo2AsyncNodeSet = new Set<NodeName>([NodeName.DEMO2_ASYNCNODE]);

// == Transaction =================================================================
export const highlightDemo2AsyncNodes = (editor: Editor, transaction: Transaction<NotebookSchemaType>) => {
  if(!wereNodesAffectedByTransaction(transaction, demo2AsyncNodeSet)) return/*nothing to do*/;

  // --------------------------------------------------------------------------------
  const pluginState = getHighlightReplacedTextState(editor.state),
        demo2AsyncNodeStorage = getNodeViewStorage(editor, NodeName.DEMO2_ASYNCNODE);

  demo2AsyncNodeStorage.forEachNodeView(demo2AsyncNodeView => {
    const { node } = demo2AsyncNodeView;
    if(hashString(node.textContent) === node.attrs.lastExecutionHash) {
      const highlightFrom = demo2AsyncNodeView.getPos() + node.textContent.indexOf(node.attrs.lastExecutionReplacement) + 1/*account for start of node*/,
        highlightTo = highlightFrom + node.attrs.lastExecutionReplacement.length + 1/*account for start of node*/;

      editor.chain().command((props) => {
        const { dispatch, tr } = props;
        if(!dispatch) throw new Error('dispatch undefined when it should not');

        // (SEE: highlightReplacedText.ts)
        tr.setMeta(HISTORY_META, false/*do not add to history*/)
          .setMeta(highlightReplacedTextKey, {
            mapOperation: 'set',
            highlightedNodeId: node.attrs.id,
            from: highlightFrom,
            to: highlightTo,
          } as HighlightReplacedTextMeta);

        dispatch(tr);
        return true;
      }).run();

    } else if(pluginState.highlightedDemo2AsyncNodes.has(node.attrs.id)) {
      // content hash no longer matches, remove decoration (SEE: highlightReplacedText.ts)
      editor.chain().command((props) => {
        const { dispatch, tr } = props;
        if(!dispatch) throw new Error('dispatch undefined when it should not');

        // (SEE: highlightReplacedText.ts)
        tr.setMeta(HISTORY_META, false/*do not add to history*/)
          .setMeta(highlightReplacedTextKey, {
            mapOperation: 'set',
            highlightedNodeId: node.attrs.id,
            from: 0/*ignored by plugin*/,
            to: 0/*ignored by plugin*/,
          } as HighlightReplacedTextMeta);

        dispatch(tr);
        return true;
      }).run();
    }/* else -- node content no longer matches and node is not currently decorated, do nothing */
  });
};
