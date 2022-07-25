import { callOrReturn, getExtensionField, mergeAttributes, Node } from '@tiptap/core';
import { columnResizing, tableEditing } from 'prosemirror-tables';

import { isTableNode, NodeName, SetAttributeType, TableOptions, TableNodeSpec, MIN_CELL_WIDTH, TABLE_ID, HANDLE_DETECTION_AREA, TABLE_ROLE } from 'common';

import { NodeViewStorage } from 'notebookEditor/model/NodeViewStorage';

import { setAttributeParsingBehavior } from '../util/attribute';
import { safeParseTag } from '../util/parse';
import { addColumnAfterCommand, addColumnBeforeCommand, addRowAfterCommand, addRowBeforeCommand, deleteColumnCommand, deleteRowCommand, deleteTableCommand, fixTablesCommand, goToNextCellCommand, goToPreviousCellCommand, insertTableCommand, mergeCellsCommand, setCellAttributeCommand, setCellSelectionCommand, splitCellCommand, toggleHeaderCellCommand, toggleHeaderColumnCommand, toggleHeaderRowCommand } from './command';
import { TableView } from './TableView';
import { deleteTableWhenAllCellsSelected } from './util';

// ********************************************************************************
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table/src/table.ts

// == Node ========================================================================
export const Table = Node.create<TableOptions, NodeViewStorage<TableView>>({
  ...TableNodeSpec,

  // -- Attribute -----------------------------------------------------------------
  addAttributes() { return { id: setAttributeParsingBehavior('id', SetAttributeType.STRING, TABLE_ID) }; },

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  addOptions() {/*FIXME: Type Conflict*/
    return {
      resizable: false,
      handleWidth: HANDLE_DETECTION_AREA,
      cellMinWidth: MIN_CELL_WIDTH,
      View: TableView,
      lastColumnResizable: true,
      allowTableNodeSelection: false,
    };
  },

  // -- Command -------------------------------------------------------------------
  addCommands() {
    return {
      // .. Table .................................................................
      insertTable: insertTableCommand,
      deleteTable: deleteTableCommand,
      fixTables: fixTablesCommand,

      // .. Column ................................................................
      addColumnBefore: addColumnBeforeCommand,
      addColumnAfter: addColumnAfterCommand,
      deleteColumn: deleteColumnCommand,
      toggleHeaderColumn: toggleHeaderColumnCommand,

      // .. Row ...................................................................
      addRowBefore: addRowBeforeCommand,
      addRowAfter: addRowAfterCommand,
      deleteRow: deleteRowCommand,
      toggleHeaderRow: toggleHeaderRowCommand,

      // .. Cell ..................................................................
      mergeCells: mergeCellsCommand,
      splitCell: splitCellCommand,
      toggleHeaderCell: toggleHeaderCellCommand,
      mergeOrSplit: mergeCellsCommand,
      setCellAttribute: setCellAttributeCommand,
      goToNextCell: goToNextCellCommand,
      goToPreviousCell: goToPreviousCellCommand,
      setCellSelection: setCellSelectionCommand,
    };
  },

  addKeyboardShortcuts() {
    return {
      'Tab': () => {
        if(this.editor.commands.goToNextCell())
          return true;
        /* else -- cannot go to the next cell */

        if(!this.editor.can().addRowAfter())
          return false;
        /* else -- can add a row after, do so and then go to next cell */

        return this.editor.chain().addRowAfter().goToNextCell().run();
      },
      'Shift-Tab': () => this.editor.commands.goToPreviousCell(),
      'Backspace': deleteTableWhenAllCellsSelected,
      'Mod-Backspace': deleteTableWhenAllCellsSelected,
      'Delete': deleteTableWhenAllCellsSelected,
      'Mod-Delete': deleteTableWhenAllCellsSelected,
    };
  },

  // -- Plugin --------------------------------------------------------------------
  addProseMirrorPlugins() {
    const isResizable = this.options.resizable && this.editor.isEditable;

    return [
      ...(isResizable ? [columnResizing({
        handleWidth: this.options.handleWidth,
        cellMinWidth: this.options.cellMinWidth,

        View: this.options.View,

        // TODO: Fix when PM adds types to pm-tables
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore (incorrect type)
        lastColumnResizable: this.options.lastColumnResizable,
      })] : []),

      tableEditing({ allowTableNodeSelection: this.options.allowTableNodeSelection }),
    ];
  },

  // -- Storage -------------------------------------------------------------------
  addStorage() { return new NodeViewStorage<TableView>(); },

  // -- Schema Extension ----------------------------------------------------------
  // Adds 'tableRole' as a property that node specs can define
  // NOTE: Used by Cell, Header, Row, Table nodes
  extendNodeSchema(extension) {
    const context = {
      name: extension.name,
      options: extension.options,
      storage: extension.storage,
    };
    return { tableRole: callOrReturn(getExtensionField(extension, TABLE_ROLE, context)) };
  },

  // -- View ----------------------------------------------------------------------
  addNodeView() {
    return ({ editor, node, getPos }) => {
      if(!isTableNode(node)) throw new Error(`Unexpected node type (${node.type.name}) while adding Table NodeView.`);
      return new TableView(editor, node, this.storage, getPos, this.options.cellMinWidth);
    };
  },
  parseHTML() { return [safeParseTag(NodeName.TABLE)]; },
  renderHTML({ HTMLAttributes }) { return [NodeName.TABLE, mergeAttributes(HTMLAttributes)/*add attrs to pasted html*/, 0]; },
});
