import { MdOutlineTableChart } from 'react-icons/md';

import { NodeName } from 'common';
import { parentIsOfType } from 'notebookEditor/extension/util/node';

import { ToolItem } from './type';

// ********************************************************************************
// == Common Nodes ================================================================
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

export const commonNodes = [ table ];
