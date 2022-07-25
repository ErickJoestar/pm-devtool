import { CommandProps, ParentConfig } from '@tiptap/core';
import { TextSelection } from 'prosemirror-state';
import { addColumnAfter, addColumnBefore, addRowAfter, addRowBefore, deleteColumn, deleteRow, deleteTable, fixTables, goToNextCell, mergeCells, setCellAttr, splitCell, toggleHeader, toggleHeaderCell, CellSelection } from 'prosemirror-tables';

import { TABLE_DEFAULT_ROWS, TABLE_DEFAULT_COLUMNS, TABLE_DEFAULT_WITH_HEDER_ROW } from 'common';

import { createTable } from './util';

// ********************************************************************************
// == Type ========================================================================
// NOTE: Usage of ambient module to ensure command is TypeScript-registered
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    table: {
      /** Insert a table */
      insertTable: (options?: { rows?: number; cols?: number; withHeaderRow?: boolean; }) => ReturnType;

      /** Add a column before the currently selected cell */
      addColumnBefore: () => ReturnType;

      /** Add a column after the currently selected cell */
      addColumnAfter: () => ReturnType;

      /** Delete the column of the currently selected cell */
      deleteColumn: () => ReturnType;

      /** Add a row before the currently selected cell */
      addRowBefore: () => ReturnType;

      /** Add a row after the currently selected cell */
      addRowAfter: () => ReturnType;

      /** Delete the row of the currently selected cell */
      deleteRow: () => ReturnType;

      /** Delete the table holding the currently selected cell */
      deleteTable: () => ReturnType;

      /** Merge the currently selected cells */
      mergeCells: () => ReturnType;

      /** Split the currently selected cells */
      splitCell: () => ReturnType;

      /** Toggle the header for the currently selected column */
      toggleHeaderColumn: () => ReturnType;

      /** Toggle the header for the currently selected row */
      toggleHeaderRow: () => ReturnType;

      /** Toggle the header for the currently selected cell */
      toggleHeaderCell: () => ReturnType;

      /** Merge or split the currently selected cells */
      mergeOrSplit: () => ReturnType;

      /** Set an attribute for the currently selected cell */
      setCellAttribute: (name: string, value: any) => ReturnType;

      /** Move the cursor to the next cell */
      goToNextCell: () => ReturnType;

      /** Move the cursor to the previous cell */
      goToPreviousCell: () => ReturnType;

      /** Fix the tables according to the PM algorithm */
      fixTables: () => ReturnType;

      /** Set a CellSelection */
      setCellSelection: (position: { anchorCell: number; headCell?: number; }) => ReturnType;
    };
  }

  // -- NodeConfig ----------------------------------------------------------------
  interface NodeConfig<Options, Storage> {
    /** Add tableRole as a property that nodes can define in their spec */
    tableRole?: string | ((this: {
      name: string;
      options: Options;
      storage: Storage;
      parent: ParentConfig<NodeConfig<Options>>['tableRole'/*NOTE: -must- match role name in Table node spec*/];
    }) => string);
  }
}

// == Implementation ==============================================================
// -- Table -----------------------------------------------------------------------
export const insertTableCommand = ({ rows = TABLE_DEFAULT_ROWS, cols = TABLE_DEFAULT_COLUMNS, withHeaderRow = TABLE_DEFAULT_WITH_HEDER_ROW } = {}) => ({ tr, dispatch, editor }: CommandProps) => {
  if(!dispatch) return false;

  const node = createTable(editor.schema, rows, cols, withHeaderRow);
  const offset = tr.selection.anchor + 1/*inside the table*/;

  tr.replaceSelectionWith(node)
    .scrollIntoView()
    .setSelection(TextSelection.near(tr.doc.resolve(offset)));
  return true;
};

export const deleteTableCommand = () => ({ state, dispatch }: CommandProps) => deleteTable(state, dispatch);

export const fixTablesCommand = () => ({ state, dispatch }: CommandProps) => {
  if(!dispatch) return false;
  fixTables(state, undefined);
  return true;
};

// -- Column ----------------------------------------------------------------------
export const addColumnBeforeCommand = () => ({ state, dispatch }: CommandProps) => addColumnBefore(state, dispatch);
export const addColumnAfterCommand = () => ({ state, dispatch }: CommandProps) => addColumnAfter(state, dispatch);
export const deleteColumnCommand = () => ({ state, dispatch }: CommandProps) => deleteColumn(state, dispatch);
export const toggleHeaderColumnCommand = () => ({ state, dispatch }: CommandProps) => toggleHeader('column')(state, dispatch);

// -- Row -------------------------------------------------------------------------
export const addRowBeforeCommand = () => ({ state, dispatch }: CommandProps) => addRowBefore(state, dispatch);
export const addRowAfterCommand = () => ({ state, dispatch }: CommandProps) => addRowAfter(state, dispatch);
export const deleteRowCommand = () => ({ state, dispatch }: CommandProps) => deleteRow(state, dispatch);
export const toggleHeaderRowCommand = () => ({ state, dispatch }: CommandProps) => toggleHeader('row')(state, dispatch);

// -- Cell ------------------------------------------------------------------------
export const mergeCellsCommand = () => ({ state, dispatch }: CommandProps) => mergeCells(state, dispatch);
export const splitCellCommand = () => ({ state, dispatch }: CommandProps) => splitCell(state, dispatch);
export const toggleHeaderCellCommand = () => ({ state, dispatch }: CommandProps) => toggleHeaderCell(state, dispatch);
export const mergeOrSplitCommand = () => ({ state, dispatch }: CommandProps) => {
  if(mergeCells(state, dispatch))
    return true/*cells can be merged*/;
  /* else -- cells cannot be merged, split */

  return splitCell(state, dispatch);
};
export const setCellAttributeCommand = (name: string, value: any) => ({ state, dispatch }: CommandProps) => setCellAttr(name, value)(state, dispatch);
export const goToNextCellCommand = () => ({ state, dispatch }: CommandProps) => goToNextCell(1/*move forwards*/)(state, dispatch);
export const goToPreviousCellCommand = () => ({ state, dispatch }: CommandProps) => goToNextCell(-1/*move backwards*/)(state, dispatch);
export const setCellSelectionCommand = (position: { anchorCell: number; headCell?: number; }) => ({ tr, dispatch }: CommandProps) => {
  if(!dispatch) return false;

  const selection = CellSelection.create(tr.doc, position.anchorCell, position.headCell);
  tr.setSelection(selection as any/*FIXME: Fix when PM adds types to pm-tables*/);

  return true;
};
