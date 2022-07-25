import { Editor } from '@tiptap/core';
import { Fragment } from 'prosemirror-model';
import { NodeSelection, Selection, TextSelection, Transaction } from 'prosemirror-state';

import { AsyncNodeStatus, Demo2AsyncNodeType, NotebookSchemaType } from 'common';

import { AbstractAsyncNodeModel } from 'notebookEditor/extension/asyncNode/nodeView/model';
import { HISTORY_META } from 'notebookEditor/extension/history/History';
import { getPosType, resolveNewSelection } from 'notebookEditor/extension/util/node';
import { hashString } from 'notebookEditor/extension/util/parse';

import { highlightReplacedTextKey, HighlightReplacedTextMeta } from '../highlightReplacedText';
import { Demo2AsyncNodeStorageType } from './controller';

// ********************************************************************************
export class Demo2AsyncNodeModel extends AbstractAsyncNodeModel<string, Demo2AsyncNodeType, Demo2AsyncNodeStorageType> {
  // == Lifecycle =================================================================
  public constructor(editor: Editor, node: Demo2AsyncNodeType, storage: Demo2AsyncNodeStorageType, getPos: getPosType) {
    super(editor, node, storage, getPos);
  }

  // == Abstract Methods ==========================================================
  // creates a promise that returns a random string after 2 seconds
  protected createPromise() {
    return new Promise<string>(resolve => setTimeout(() => resolve(createRandomString(Math.floor(Math.random() * (100/*T&E*/) + 1))), 2000/*ms*/));
  }

  public async executeAsyncCall(): Promise<boolean> {
    if(!this.node.textContent.includes(this.node.attrs.replaceText)) {
      // NOTE: Displayed as a toast by React
      // (SEE: ExecuteAsyncNodeButton.tsx)
      // (SEE: AbstractAsyncNodeModel#executeAsyncCall)
      throw new Error('This replace text is not included in the content of the node');
    }/* else -- node contains the word to replace */

    try {
      const result = await this.createPromise(),
          finalContent = this.node.textContent;


      if(!finalContent.includes(this.node.attrs.replaceText)) {
        // FIXME: Choose what to do in Notebook for this situation. Some options
        //        include using the PM-Collab algorithm to resolve how the content
        //        will be inserted, replacing the first instance of the word found,
        //        using the server to perform the call, adding extra state, etc
        throw new Error('Content changed in between promise resolution');
      }/* else -- content is the same */

      // no longer performing async operation, allow transaction below to pass
      // (SEE: AsyncNode.ts)
      this.setPerformingAsyncOperation(false);

      // NOTE: if this errors (e.g. node got deleted in between replacement)
      //       it will be caught by catch below
      this.editor.chain().command((props) => {
        const { dispatch, tr } = props;
        if(!dispatch) throw new Error('dispatch undefined when it should not');

        const replacementStartOffset = this.node.textContent.indexOf(this.node.attrs.replaceText) + 1/*account for start of node*/,
              highlightFrom = this.getPos() + replacementStartOffset,
              highlightTo = highlightFrom + result.length;

        const thisNodePos = this.getPos(),
              resolvedAnchor = tr.doc.resolve(thisNodePos),
              resolvedHead = tr.doc.resolve(thisNodePos + this.node.nodeSize);

        const newNode = this.node.copy(Fragment.from(this.editor.schema.text(finalContent.replace(this.node.attrs.replaceText, result)))) as Demo2AsyncNodeType/*by contract*/;
              newNode.attrs.lastExecutionHash = hashString(newNode.textContent),
              newNode.attrs.lastExecutionReplacement = result,
              newNode.attrs.lastExecutionText = this.node.attrs.replaceText,
              newNode.attrs.status = this.getStatusFromResult(result);

            const { selection: startingSelection } = tr,
                  { pos: cursorPosBeforeReplacement } = startingSelection.$anchor,
                  replacementStartPos = thisNodePos + replacementStartOffset;

        tr.setSelection(new TextSelection(resolvedAnchor, resolvedHead))
          .replaceSelectionWith(newNode)
          .setSelection(computeTextSelectionAfterReplacement(tr, startingSelection, cursorPosBeforeReplacement, replacementStartPos, this.node.attrs.replaceText, result))
          .setMeta(HISTORY_META, false/*do not include in the history*/)
          .setMeta(highlightReplacedTextKey/*(SEE: highlightReplacedText.ts)*/, {
            mapOperation: 'set',
            highlightedNodeId: this.node.attrs.id,
            from: highlightFrom,
            to: highlightTo,
          } as HighlightReplacedTextMeta);
        dispatch(tr);
        return true;
      }).run();
    } catch(error) {
      // node got deleted while performing the replacement call
      console.warn(error);
      return false/*view not updated*/;
    }

    return true/*view updated*/;
  }

  protected getStatusFromResult(result: string) {
    return AsyncNodeStatus.SUCCESS/*default*/;
  }

  public isAsyncNodeDirty(): boolean {
    return this.node.attrs.replaceText !== this.node.attrs.lastExecutionText;
  }
}

// == Util ==============================================================================
// -- Promise ---------------------------------------------------------------------------
const randomStringChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const createRandomString = (length: number) => {
  let result = '';
  for( let i = 0; i < length; i++ ) {
    result += randomStringChars.charAt(Math.floor(Math.random() * randomStringChars.length));
  }
  return result;
};

// -- Selection -------------------------------------------------------------------------
/**
 * Computes the new TextSelection for the cursor once the promise resolves. Since the
 * result's textContent is inserted into the document, the new position must take into
 * account the result's length
 * @param tr The transaction that will replace the content
 * @param startingSelection The transaction's selection before any change is made
 * @param cursorPosBeforeReplacement The cursor position before the replacement is done
 * @param replacementStartPos The position where the replaced text begins
 * @param replacedText The text that will be replaced
 * @param replacedWithText The text with which the replacedText will be replaced
 * @returns The resulting selection after taking into account the differences in the
 * length of the replacedText and the replacedWithText
 */
const computeTextSelectionAfterReplacement = (tr: Transaction<NotebookSchemaType>, startingSelection: Selection<NotebookSchemaType>, cursorPosBeforeReplacement: number, replacementStartPos: number, replacedText: string, replacedWithText: string) => {
  if(cursorPosBeforeReplacement < replacementStartPos) {
    // cursorPos was behind the replaced text, regular resolve is enough
    return resolveNewSelection(startingSelection, tr);
  }/* else -- cursorPos was after the replaced text, new cursorPos must be computed */

  const cursorPosDifference = replacedWithText.length - replacedText.length,
        cursorPosAfterReplacement = cursorPosBeforeReplacement + cursorPosDifference;

  if(tr.doc.nodeAt(cursorPosAfterReplacement)) {
    return new NodeSelection(tr.doc.resolve(cursorPosAfterReplacement));
  } else {
    return new TextSelection(tr.doc.resolve(cursorPosAfterReplacement));
  }
};
