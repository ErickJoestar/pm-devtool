import { EditorState, PluginKey, Transaction } from 'prosemirror-state';
import { Node as ProseMirrorNode } from 'prosemirror-model';

import { HISTORY_META } from '../../../../notebookEditor/command/type';
import { AttributeType } from '../../../attribute';
import { NodeName } from '../../../node';
import { TableMap } from '../class';
import { getTableNodeTypes } from '../node';
import { TableProblem, TableRole } from '../type';
import { setTableNodeAttributes, removeColSpan } from '../util';


// ********************************************************************************
// NOTE: these are inspired by https://github.com/ProseMirror/prosemirror-tables/blob/master/src/fixtables.js

// helpers for normalizing Table Nodes, ensuring no Cells overlap and that each
// row has the same width, using problems reported by TableMap

// == Constant ====================================================================
const fixTablesKey = new PluginKey('fix-tables');

// == Fix =========================================================================
/**
 * inspect all Tables in the given State's Document and return a
 * Transaction that fixes them, if necessary. If 'oldState' is given
 * then that is assumed to hold a previous, known-good State, which
 * will be used to avoid re-scanning unchanged parts of the Document
 */
 export const fixTables = (oldState: EditorState | undefined/*validate descendants of newState*/, newState: EditorState): Transaction | undefined => {
  let tr: Transaction | undefined = undefined/*default*/;

  const check = (node: ProseMirrorNode, pos: number) =>  {
    if(node.type.spec.tableRole === TableRole.Table) {
      tr = fixTable(newState, node, pos, tr);
      if(tr) {
        tr.setMeta(HISTORY_META, false/*do not add to history*/);
      } /* else -- Transaction was not modified */

    } /* else -- not a Node with a TableRole, ignore */
  };

  if(!oldState) {
    newState.doc.descendants(check);
  } else if(oldState.doc !== newState.doc) {
    changedDescendants(oldState.doc, newState.doc, 0/*no offset*/, check);
  }

  return tr;
};

/**
 * fix the given Table if necessary. Will append to the Transaction
 * it was given (i.e. if non null), or create a new one if necessary
 */
 export const fixTable = (state: EditorState, table: ProseMirrorNode, tablePos: number, tr?: Transaction) => {
  const map = TableMap.get(table);
  if(!map.problems) return tr/*nothing to do*/;

  if(!tr) {
    tr = state.tr;
  } /* else -- use the given Transaction */

  // track which rows require Cells to be added so that they can be
  // adjusted when fixing collisions
  const mustAdd = [/*default empty*/];
  for(let i = 0; i < map.height; i++) {
    mustAdd.push(0);
  }

  for(let i = 0; i < map.problems.length; i++) {
    const problem = map.problems[i];
    if(problem.type === TableProblem.Collision) {
      const cell = table.nodeAt(problem.pos);
      if(!cell) continue/*nothing to do*/;

      for(let j = 0; j < cell.attrs[AttributeType.RowSpan]; j++) {
        mustAdd[problem.row + j] += problem.n;
      }

      tr.setNodeMarkup(tr.mapping.map(tablePos + 1 + problem.pos), null/*maintain type*/, removeColSpan(cell.attrs, cell.attrs[AttributeType.ColSpan] - problem.n, problem.n));

    } else if(problem.type == TableProblem.Missing) {
      mustAdd[problem.row] += problem.n;

    } else if(problem.type === TableProblem.OverlongRowSpan) {
      const cell = table.nodeAt(problem.pos);
      if(!cell) continue/*nothing to do*/;

      tr.setNodeMarkup(tr.mapping.map(tablePos + 1 + problem.pos), null/*maintain type*/, setTableNodeAttributes(cell.attrs, AttributeType.RowSpan, cell.attrs[AttributeType.RowSpan] - problem.n));

    } else if(problem.type === TableProblem.ColWidthMistMatch) {
      const cell = table.nodeAt(problem.pos);
      if(!cell) continue/*nothing to do*/;

      tr.setNodeMarkup(tr.mapping.map(tablePos + 1 + problem.pos), null/*maintain type*/, setTableNodeAttributes(cell.attrs, AttributeType.ColWidth, problem.colWidth));
    }
  }

  let first: number | null = null/*default*/;
  let last: number | null = null/*default*/;
  for(let i = 0; i < mustAdd.length; i++) {
    if(mustAdd[i]) {
      if(first == null) first = i;
      last = i;
    } /* else -- no need to add */
  }

  // add the necessary Cells, using a heuristic for whether to add the
  // Cells at the start or end of the rows (if it looks like a 'bite'
  // was taken out of the table, add Cells at the start of the row
  // after the bite. Otherwise add them at the end).
  for(let i = 0, pos = tablePos + 1; i < map.height; i++) {
    const row = table.child(i);
    const end = pos + row.nodeSize;
    const add = mustAdd[i];

    if(add > 0) {
      let tableNodeTypeName = NodeName.CELL/*default*/;
      if(row.firstChild) {
        tableNodeTypeName = row.firstChild.type.spec.tableRole;
      } /* else -- not the first child fo the row */

      const nodes: ProseMirrorNode[] = [];
      for(let j = 0; j < add; j++) {
        const requiredType = getTableNodeTypes(state.schema)[tableNodeTypeName];
        const requiredNode = requiredType.createAndFill();

        if(requiredNode) {
          nodes.push(requiredNode);
        } /* else -- could not create Node, do not add*/
      }

      let side = (i == 0 || first == i - 1) && last == i ? pos + 1 : end - 1;
      tr.insert(tr.mapping.map(side), nodes);
    }

    pos = end;
  }

  return tr.setMeta(fixTablesKey, { fixTables: true });
};

// == Util ========================================================================
/**
 * iterate through the Nodes that changed in a Document comparing it to the
 * previous one
 */
const changedDescendants = (oldDoc: ProseMirrorNode, currentDoc: ProseMirrorNode, offset: number, callback: (node: ProseMirrorNode, offset: number) => void) => {
  const oldSize = oldDoc.childCount;
  const curSize = currentDoc.childCount;

  outerLoop: for(let i = 0, j = 0; i < curSize; i++) {
    const child = currentDoc.child(i);
    for(let scan = j, e = Math.min(oldSize, i + 3); scan < e; scan++) {
      if(oldDoc.child(scan) == child) {
        j = scan + 1;
        offset += child.nodeSize;
        continue outerLoop;
      } /* else -- does not equal the child, do nothing special */
    }

    callback(child, offset);

    if(j < oldSize && oldDoc.child(j).sameMarkup(child)) { changedDescendants(oldDoc.child(j), child, offset + 1, callback); }
    else { child.nodesBetween(0, child.content.size, callback, offset + 1); }
    offset += child.nodeSize;
  }
};

