import { Node } from '@tiptap/core';
import { Slice } from 'prosemirror-model';
import { Plugin, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { getNodesAffectedByStepMap, AttributeType, NodeName, MarkHolderNodeSpec, SetAttributeType, NotebookSchemaType, isMarkHolderNode } from 'common';

import { getNodeOutputSpec, setAttributeParsingBehavior } from 'notebookEditor/extension/util/attribute';
import { NoOptions, NoStorage } from 'notebookEditor/model/type';

// ********************************************************************************
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-paragraph/src/paragraph.ts

// == Constant ====================================================================
// the Inclusion Set of Nodes that must maintain marks after their Content was
// deleted, if any marks were active when said Content was deleted
const blockNodesThatPreserveMarks = new Set([NodeName.HEADING, NodeName.PARAGRAPH]);

// == Node ========================================================================
export const MarkHolder = Node.create<NoOptions, NoStorage>({
  ...MarkHolderNodeSpec,

  // -- Attribute -----------------------------------------------------------------
  addAttributes() { return { [AttributeType.StoredMarks]: setAttributeParsingBehavior(AttributeType.StoredMarks, SetAttributeType.ARRAY) }; },

  // -- Plugin --------------------------------------------------------------------
  addProseMirrorPlugins() {
    return [
      new Plugin<NotebookSchemaType>({
        // -- Transaction ---------------------------------------------------------
        // when a BlockNode that must preserve Marks (SEE:
        // blockNodesThatPreserveMarks Set above) gets its Content removed but
        // the Node is not deleted (i.e., the Content's length was greater than
        // zero and now its -exactly- zero), and there were activeMarks,
        // insert a MarkHolder Node that contains the respective Marks
        appendTransaction(transactions, oldState, newState) {
          if(oldState === newState) return/*no changes*/;
          const { tr } = newState;
          let blockNodesDeletedOrAdded = false/*default*/;

          for(let i = 0; i < transactions.length; i++) {
            if(blockNodesDeletedOrAdded) break/*no changes that matter to MarkHolder behavior were done by the transaction*/;

            const { maps } = transactions[i].mapping;
            for(let stepMapIndex = 0; stepMapIndex < maps.length; stepMapIndex++) {
              // NOTE: unfortunately StepMap does not expose an array interface so that a
              //       for-loop-break construct could be used here for performance reasons
              maps[stepMapIndex].forEach((unmappedOldStart, unmappedOldEnd) => {
                const { oldNodeObjs, newNodeObjs } = getNodesAffectedByStepMap(transactions[i], stepMapIndex, unmappedOldStart, unmappedOldEnd, blockNodesThatPreserveMarks);
                if(oldNodeObjs.length !== newNodeObjs.length) {
                  blockNodesDeletedOrAdded = true;
                }/* else -- only the Content of the Nodes was modified, check its length */

                for(let i = 0; i < newNodeObjs.length; i++) {
                  if(blockNodesDeletedOrAdded) break/*no changes that matter to MarkHolder behavior were done by the transaction*/;

                  if(oldNodeObjs[i].node.content.size > 0 && newNodeObjs[i].node.content.size < 1) {
                    if(!transactions[i].storedMarks) {
                      continue/*do not insert MarkHolder since there were no stored marks*/;
                    }/* else -- there are stored marks, insert MarkHolder */

                    tr.insert(newNodeObjs[i].position + 1/*inside the parent*/, newState.schema.nodes[NodeName.MARK_HOLDER].create({ storedMarks: transactions[i].storedMarks }));
                  }/* else -- new content is greater than zero, no need to add MarkHolder */
                }
              });
              if(blockNodesDeletedOrAdded) break/*no changes that matter to MarkHolder behavior were done by the transaction*/;
            }
          }

          return tr;
        },

        // -- Props ---------------------------------------------------------------
        props: {
          // When these return true, the event is manually handled (PM won't interfere)

          // .. Handler ...............................................................
          // when the User types something and the cursor is currently past a
          // MarkHolder, delete the MarkHolder and ensure the User's input gets the
          // MarkHolder marks applied to it
          handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
            const { dispatch, tr, pos } = getUtilsFromView(view),
                  markHolder = view.state.doc.nodeAt(pos);
            if(!markHolder || !isMarkHolderNode(markHolder)) {
              return false/*let PM handle the event*/;
            }/* else -- handle event */

            if(event.key === 'Backspace') {
              const parentPos = pos - 1/*by contract since MarkHolder gets inserted at start of parent Node*/;
              tr.setSelection(new TextSelection(tr.doc.resolve(parentPos), tr.doc.resolve(parentPos + view.state.selection.$anchor.parent.nodeSize)))
                .deleteSelection();
              dispatch(tr);
              return true/*event handling done*/;
            }/* else -- not handling backspace */

            if(event.ctrlKey || event.altKey || event.metaKey || event.key.length > 1) {
              return false/*do not handle event*/;
            }/* else -- handle event */

            tr.setSelection(new TextSelection(tr.doc.resolve(pos), tr.doc.resolve(pos + markHolder.nodeSize)))
              .setStoredMarks(markHolder.attrs.storedMarks)
              .replaceSelectionWith(this.editor.schema.text(event.key));
            dispatch(tr);
            return true/*event handled*/;
          },

          // ..........................................................................
          // when the User pastes something and the cursor is currently past a
          // MarkHolder, delete the MarkHolder and ensure the pasted slice gets the
          // MarkHolder marks applied to it
          handlePaste: (view: EditorView, event: ClipboardEvent, slice: Slice) => {
            const { dispatch, tr, pos } = getUtilsFromView(view),
                  markHolder = view.state.doc.nodeAt(pos);
            if(!markHolder || !isMarkHolderNode(markHolder)) {
              return false/*let PM handle the event*/;
            }/* else -- handle event */

            tr.setSelection(new TextSelection(tr.doc.resolve(pos), tr.doc.resolve(pos + markHolder.nodeSize)))
              .replaceSelection(slice);
            markHolder.attrs.storedMarks?.forEach(storedMark => tr.addMark(pos, pos + slice.size, storedMark));
            dispatch(tr);
            return true/*event handled*/;
          },
        },
      }),
    ];
  },

  // -- View ----------------------------------------------------------------------
  parseHTML() { return [{ tag: NodeName.MARK_HOLDER }]; },
  renderHTML({ node, HTMLAttributes }) { return getNodeOutputSpec(node, HTMLAttributes); },
});

// == Util ========================================================================
const getUtilsFromView = (view: EditorView) => {
  const { dispatch } = view,
  { tr } = view.state,
  pos = view.state.selection.$anchor.pos - 1/*selection will be past the MarkHolder*/;

  return { dispatch, tr, pos };
};
