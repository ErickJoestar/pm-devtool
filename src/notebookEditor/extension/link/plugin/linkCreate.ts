import { combineTransactionSteps, findChildrenInRange, getChangedRanges, getMarksBetween } from '@tiptap/core';
import { find, test } from 'linkifyjs';
import { Plugin, PluginKey } from 'prosemirror-state';

import { NotebookSchemaType, PREVENT_LINK_META } from 'common';
import { NoPluginState } from 'notebookEditor/model/type';

// ********************************************************************************
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-link/src/helpers/autolink.ts

// == Plugin ======================================================================
const linkCreateKey = new PluginKey<NoPluginState, NotebookSchemaType>('linkCreateKey');
export const linkCreate = (validate?: (url: string) => boolean): Plugin => {
  return new Plugin({
    // -- Setup -------------------------------------------------------------------
    key: linkCreateKey,

    // -- Transaction -------------------------------------------------------------
    // Ensures that links get created when the user types
    // something that is a valid link in the editor
    appendTransaction: (transactions, oldState, newState) => {
      const docChanged = transactions.some(transaction => transaction.docChanged) && !oldState.doc.eq(newState.doc),
            preventAutolink = transactions.some(transaction => transaction.getMeta(PREVENT_LINK_META));
      if(!docChanged || preventAutolink)
        return/*nothing to do*/;

      const linkMarkType = newState.schema.marks.link;
      const { tr } = newState,
            transform = combineTransactionSteps(oldState.doc, [...transactions]),
            { mapping } = transform,
            changes = getChangedRanges(transform);

      changes.forEach(({ oldRange, newRange }) => {
        // Check if links need to be removed
        getMarksBetween(oldRange.from, oldRange.to, oldState.doc)
          .filter(item => item.mark.type === linkMarkType)
          .forEach(oldMark => {
            const newFrom = mapping.map(oldMark.from),
                  newTo = mapping.map(oldMark.to),
                  newMarks = getMarksBetween(newFrom, newTo, newState.doc).filter(item => item.mark.type === linkMarkType);
            if(!newMarks.length) return;
            /* else -- there was a link mark */

            const newMark = newMarks[0]/*guaranteed to be link type by filter*/;
            const oldLinkText = oldState.doc.textBetween(oldMark.from, oldMark.to, undefined/*no block separator*/, ' '/*add a space for each non-text leaf-node found*/),
                  newLinkText = newState.doc.textBetween(newMark.from, newMark.to, undefined/*no block separator*/, ' '/*add a space for each non-text leaf-node found*/),
                  wasLink = test(oldLinkText),
                  isLink = test(newLinkText);

            // remove the link only if there was a link before and now it is not,
            // since manually added links should not be removed
            if(wasLink && !isLink)
              tr.removeMark(newMark.from, newMark.to, linkMarkType);
          });

        // check if new links can be added
        findChildrenInRange(newState.doc, newRange, node => node.isTextblock)
          .forEach(textBlock => {
            // a placeholder for leaf nodes must be defined
            // so that the link position can be correctly calculated
            const text = newState.doc.textBetween(
              textBlock.pos,
              textBlock.pos + textBlock.node.nodeSize,
              undefined/*no block separator*/,
              ' '/*add a space for each non-text leaf-node found*/
            );

            // do not turn textBlock into link when user just inserted a link and
            // adds a space (since this would incorrectly turn the previous
            // text in the block into a link too)
            if(text.endsWith(' ')) return;

            find(text)
              .filter(link => link.isLink)
              .filter(link => {
                if(validate)
                  return validate(link.value);

                return true;
              })
              // calculate link position
              .map(link => ({
                ...link,
                from: textBlock.pos + link.start + 1,
                to: textBlock.pos + link.end + 1,
              }))
              // check if link is within the changed range
              .filter(link => {
                const fromIsInRange = newRange.from >= link.from && newRange.from <= link.to;
                const toIsInRange = newRange.to >= link.from && newRange.to <= link.to;

                return fromIsInRange || toIsInRange;
              })
              // add link mark
              .forEach(link => tr.addMark(link.from, link.to, linkMarkType.create({ href: link.href })));
          });
      });

      if(!tr.steps.length) return/*nothing to do*/;

      return tr;
    },
  });
};
