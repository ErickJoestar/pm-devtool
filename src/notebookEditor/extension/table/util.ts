import { findParentNodeClosestToPos, KeyboardShortcutCommand, Attribute } from '@tiptap/core';
import { NodeType, Fragment, Node as ProseMirrorNode, Schema } from 'prosemirror-model';
import { CellSelection } from 'prosemirror-tables';

import { NotebookSchemaType, NodeName } from 'common';

// ********************************************************************************
// == Table =======================================================================
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table/src/utilities/createTable.ts
export const createTable = (schema: NotebookSchemaType, rowsCount: number, colsCount: number, withHeaderRow: boolean, cellContent?: Fragment<Schema> | ProseMirrorNode<Schema> | Array<ProseMirrorNode<Schema>>): ProseMirrorNode => {
  const types = getTableNodeTypes(schema);
  const headerCells = [];
  const cells = [];

  for(let index = 0; index < colsCount; index += 1) {
    const cellType = types.cell,
          headerType = types.header_cell;
    if(!cellType || !headerType) throw new Error('Cell or Header type not defined defined. Check that the correct names are being used');

    const cell = createCell(cellType, cellContent);

    if(!cell) throw new Error('Cell not created successfully when it was meant to.');
    cells.push(cell);

    if(withHeaderRow) {
      const headerCell = createCell(headerType, cellContent);
      if(!headerCell) throw new Error('Header cell not created successfully when it was meant to.');

      headerCells.push(headerCell);
    }
    /* else -- do not add header row */
  }

  const rows = [];
  for(let index = 0; index < rowsCount; index += 1) {
    rows.push(types.row.createChecked(null, withHeaderRow && index === 0 ? headerCells : cells));
  }

  return types.table.createChecked(null, rows);
};

// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table/src/utilities/deleteTableWhenAllCellsSelected.ts
export const deleteTableWhenAllCellsSelected: KeyboardShortcutCommand = ({ editor }) => {
  const { selection } = editor.state;

  if(!isCellSelection(selection))
    return false;
  /* else -- cell selection, see if all cells selected */

  let cellCount = 0;
  const table = findParentNodeClosestToPos(selection.ranges[0].$from, node => {
    return node.type.name === NodeName.TABLE;
  });

  table?.node.descendants(node => {
    if(node.type.name === NodeName.TABLE) {
      return false;
    }

    if([NodeName.CELL, NodeName.HEADER].includes(node.type.name as NodeName/*by definition*/)) {
      cellCount += 1;
    }

    // CHECK: does this break anything?
    return true;
  });

  const allCellsSelected = cellCount === selection.ranges.length;
  if(!allCellsSelected) return false/*nothing to do*/;

  return editor.commands.deleteTable();
};

// == Cell ========================================================================
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table/src/utilities/createCell.ts
export const createCell = (cellType: NodeType, cellContent?: Fragment<NotebookSchemaType> | ProseMirrorNode<NotebookSchemaType> | Array<ProseMirrorNode<NotebookSchemaType>>): ProseMirrorNode | null | undefined => {
  if(cellContent)
    return cellType.createChecked(null, cellContent);
  /* else -- there is no content, create and fill */

  return cellType.createAndFill();
};

// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table/src/utilities/isCellSelection.ts
export const isCellSelection = (value: unknown): value is CellSelection => value instanceof CellSelection;

// == Util ========================================================================
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table/src/utilities/getTableNodeTypes.ts
export const getTableNodeTypes = (schema: NotebookSchemaType): { [key: string]: NodeType; } => {
  if(schema.cached.tableNodeTypes)
  return schema.cached.tableNodeTypes/*use cached*/;
  /* else -- there is no cached */

  const roles: { [key: string]: NodeType; } = {};
  Object.keys(schema.nodes).forEach(type => {
    const nodeType = schema.nodes[type];
    if(nodeType.spec.tableRole)
    roles[nodeType.spec.tableRole] = nodeType;
    /* else -- node does not have a tableRole, ignore node */
  });

  schema.cached.tableNodeTypes = roles/*set cached*/;
  return roles;
};

// NOTE: Since this behavior is the same for Header and Cell, its been moved here
//       (SEE: Header.ts, Cell.ts)
export const parseColWidthAttribute = (): Attribute => ({
  default: null/*not specified, default column width will be used*/,
  parseHTML: (element) => {
    const colwidth = element.getAttribute('colwidth');
    const value = colwidth
      ? [parseInt(colwidth, 10)]
      : null;

    return value;
  },
  keepOnSplit: false/*don't keep by default*/,
});
