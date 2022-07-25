import { RiDeleteColumn, RiDeleteRow, RiInsertColumnLeft, RiInsertColumnRight, RiInsertRowBottom, RiInsertRowTop, RiMore2Line, RiMoreLine } from 'react-icons/ri';
import { TiDeleteOutline } from 'react-icons/ti';

import { NodeName } from 'common';

import { Toolbar, ToolItem } from 'notebookEditor/toolbar/type';

import { parentIsOfType } from '../util/node';
import { MdOutlineTableChart } from 'react-icons/md';

//*********************************************************************************
// == Tool Items ==================================================================
export const table: ToolItem = {
  toolType: 'button',

  name: NodeName.TABLE,
  label: NodeName.TABLE,

  icon: <MdOutlineTableChart size={16} />,
  tooltip: 'Add a Table',

  shouldBeDisabled: (editor) => {
    if(editor.isActive(NodeName.TABLE)) return true;
    /* else -- selection not inside a table */

    return false;
  },
  shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.PARAGRAPH),
  onClick: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run(),
};

// == Toolbar =====================================================================
export const TableToolbar: Toolbar = {
  nodeName: NodeName.TABLE,
  toolsCollections: [
    [
      // -- Table ---------------------------------------------------------------
      {
        toolType: 'button',
        name: 'Delete Table',
        label: 'Delete Table',
        icon: <TiDeleteOutline size={16} />,
        tooltip: 'Delete Table',
        shouldBeDisabled: (editor) => {
          if(editor.isActive(NodeName.TABLE)) return false;
          /* else -- table not active */

          return true;
        },
        shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.PARAGRAPH) || editor.state.selection.toJSON().type === NodeName.CELL,
        onClick: (editor) => editor.chain().focus().deleteTable().run(),
      },

      // -- Row -----------------------------------------------------------------
      {
        toolType: 'button',
        name: 'Delete Row',
        label: 'Delete Row',
        icon: <RiDeleteRow size={16} />,
        tooltip: 'Delete Row',
        shouldBeDisabled: (editor) => {
          if(editor.isActive(NodeName.TABLE)) return false;
          /* else -- table not active */

          return true;
        },
        shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.PARAGRAPH) || editor.state.selection.toJSON().type === NodeName.CELL,
        onClick: (editor) => editor.chain().focus().deleteRow().run(),
      },
      {
        toolType: 'button',
        name: 'Add Row Above',
        label: 'Add Row Above',
        icon: <RiInsertRowTop size={16} />,
        tooltip: 'Add Row Above',
        shouldBeDisabled: (editor) => {
          if(editor.isActive(NodeName.TABLE)) return false;
          /* else -- table not active */

          return true;
        },
        shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.PARAGRAPH) || editor.state.selection.toJSON().type === NodeName.CELL,
        onClick: (editor) => editor.chain().focus().addRowBefore().run(),
      },
      {
        toolType: 'button',
        name: 'Add Row Below',
        label: 'Add Row Below',
        icon: <RiInsertRowBottom size={16} />,
        tooltip: 'Add Row Below',
        shouldBeDisabled: (editor) => {
          if(editor.isActive(NodeName.TABLE)) return false;
          /* else -- table not active */

          return true;
        },
        shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.PARAGRAPH) || editor.state.selection.toJSON().type === NodeName.CELL,
        onClick: (editor) => editor.chain().focus().addRowAfter().run(),
      },

      // -- Column --------------------------------------------------------------
      {
        toolType: 'button',
        name: 'Delete Column',
        label: 'Delete Column',
        icon: <RiDeleteColumn size={16} />,
        tooltip: 'Delete Column',
        shouldBeDisabled: (editor) => {
          if(editor.isActive(NodeName.TABLE)) return false;
          /* else -- table not active */

          return true;
        },
        shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.PARAGRAPH) || editor.state.selection.toJSON().type === NodeName.CELL,
        onClick: (editor) => editor.chain().focus().deleteColumn().run(),
      },
      {
        toolType: 'button',
        name: 'Add Column Before',
        label: 'Add Column Before',
        icon: <RiInsertColumnLeft size={16} />,
        tooltip: 'Add Column Before',
        shouldBeDisabled: (editor) => {
          if(editor.isActive(NodeName.TABLE)) return false;
          /* else -- table not active */

          return true;
        },
        shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.PARAGRAPH) || editor.state.selection.toJSON().type === NodeName.CELL,
        onClick: (editor) => editor.chain().focus().addColumnBefore().run(),
      },
      {
        toolType: 'button',
        name: 'Add Column After',
        label: 'Add Column After',
        icon: <RiInsertColumnRight size={16} />,
        tooltip: 'Add Column After',
        shouldBeDisabled: (editor) => {
          if(editor.isActive(NodeName.TABLE)) return false;
          /* else -- table not active */

          return true;
        },
        shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.PARAGRAPH) || editor.state.selection.toJSON().type === NodeName.CELL,
        onClick: (editor) => editor.chain().focus().addColumnAfter().run(),
      },

      // -- Header --------------------------------------------------------------
      {
        toolType: 'button',
        name: 'Toggle Header in First Row',
        label: 'Toggle Header in First Row',
        icon: <RiMoreLine size={16} />,
        tooltip: 'Toggle Header in First Row',

        shouldBeDisabled: (editor) => !editor.isActive(NodeName.TABLE),
        shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.PARAGRAPH) || editor.state.selection.toJSON().type === NodeName.CELL,
        onClick: (editor) => editor.chain().focus().toggleHeaderRow().run(),
      },
      {
        toolType: 'button',
        name: 'Toggle Header in First Column',
        label: 'Toggle Header in First Column',
        icon: <RiMore2Line size={16} />,
        tooltip: 'Toggle Header in First Column',

        shouldBeDisabled: (editor) => !editor.isActive(NodeName.TABLE),
        shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.PARAGRAPH) || editor.state.selection.toJSON().type === NodeName.CELL,
        onClick: (editor) => editor.chain().focus().toggleHeaderColumn().run(),
      },
    ],
  ],
};
