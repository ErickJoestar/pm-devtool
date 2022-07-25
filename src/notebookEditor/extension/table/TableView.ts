import { Editor } from '@tiptap/core';

import { TableNodeType, TABLE_CONTAINER_CLASS } from 'common';

import { AbstractNodeView } from 'notebookEditor/model/AbstractNodeView';
import { NodeViewStorage } from 'notebookEditor/model/NodeViewStorage';

import { getPosType } from '../util/node';

// ********************************************************************************
// FIXME: Use MVC paradigm

// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table/src/TableView.ts

// == Class =======================================================================
export class TableView extends AbstractNodeView<TableNodeType, NodeViewStorage<TableView>> {
  // -- Attribute -----------------------------------------------------------------
  table: HTMLElement;
  tableBody: HTMLElement;
  colgroup: HTMLElement;
  cellMinWidth: number;

  // == Life-Cycle ================================================================
  public constructor(editor: Editor, node: TableNodeType, storage: NodeViewStorage<TableView>, getPos: getPosType, cellMinWidth: number) {
    super(editor, node, storage, getPos);

    // -- Attribute ---------------------------------------------------------------
    this.cellMinWidth = cellMinWidth;

    // -- UI ----------------------------------------------------------------------
    // .. Creation ................................................................
    this.colgroup = document.createElement('colgroup');
    this.table = document.createElement('table');
    this.tableBody = document.createElement('tbody');

    // .. Setup ...................................................................
    this.dom.appendChild(this.table);
    this.table.appendChild(this.colgroup);
    this.table.appendChild(this.tableBody);

    // -- ProseMirror -------------------------------------------------------------
    this.contentDOM = this.tableBody;

    // -- Initial Render ----------------------------------------------------------
    this.updateView();
  }

  // == ProseMirror ===============================================================
  // .. Mutation ..................................................................
  // Ignore mutations that modify the attributes of the table
  public ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Element; }) {
    return mutation.type === 'attributes' && (mutation.target === this.table || this.colgroup.contains(mutation.target));
  }

  // == View ======================================================================
  protected createDomElement() {
    const dom = document.createElement('div');
          dom.className = TABLE_CONTAINER_CLASS;
    return dom;
  }

  // NOTE: This originally was TipTap's implementation of updateColumns
  // REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table/src/TableView.ts
  protected updateView(): void {
    // Update the columns of the table as needed
    const { node, table, colgroup, cellMinWidth } = this/*for convenience*/;

    const row = node.firstChild;
    if(!row) return /*nothing to do*/;

    let totalWidth = 0;
    let fixedWidth = true;
    let nextDOM = colgroup.firstChild;

    for(let i = 0, col = 0; i < row.childCount; i += 1) {
      const { colspan, colwidth } = row.child(i).attrs;

      for(let j = 0; j < colspan; j += 1, col += 1) {
        const hasWidth = colwidth && colwidth[j];
        const cssWidth = hasWidth ? `${hasWidth}px` : '';

        totalWidth += hasWidth || cellMinWidth;

        if(!hasWidth)
          fixedWidth = false;
        /* else -- has a fixed width */

        if(!nextDOM) {
          colgroup.appendChild(document.createElement('col')).style.width = cssWidth;
        } else {
          if(hasStyle(nextDOM) && nextDOM.style.width !== cssWidth) {
            nextDOM.style.width = cssWidth;
          } /* else -- nextDOM has no style, do not set style */

          nextDOM = nextDOM.nextSibling;
        }
      }
    }

    // remove columns as needed
    while(nextDOM) {
      const after = nextDOM.nextSibling;
      nextDOM.parentNode?.removeChild(nextDOM);
      nextDOM = after;
    }

    if(!(hasStyle(table))) return;
    /* else -- the table has a specific style */

    // ensure width matches
    if(fixedWidth) {
      table.style.width = `${totalWidth}px`;
      table.style.minWidth = '';
    } else {
      table.style.width = '';
      table.style.minWidth = `${totalWidth}px`;
    }
  }
}

// == Util ========================================================================
const hasStyle = (element: HTMLElement | ChildNode): element is HTMLElement => 'style' in element;
