import { RiListOrdered } from 'react-icons/ri';

import { isParagraphNode, NodeName } from 'common';

import { isNodeSelection } from 'notebookEditor/extension/util/node';
import { ToolItem } from 'notebookEditor/toolbar/type';

// ********************************************************************************
// == Tool Items ==================================================================
export const orderedList: ToolItem = {
  toolType: 'button',
  name: NodeName.ORDERED_LIST,
  label: NodeName.ORDERED_LIST,

  icon: <RiListOrdered size={16} />,
  tooltip: 'Ordered List (⌘ + Shift + 7)',

  shouldBeDisabled: (editor) => {
    const { selection } = editor.state;
    if(isNodeSelection(selection)) return true;
    if(isParagraphNode(selection.$anchor.parent)) return false;
    /* else -- selection somewhere that does not allow bullet list */

    return true;
  },
  shouldShow: (editor, depth) => depth === undefined || editor.state.selection.$anchor.depth === depth/*direct parent*/,
  onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
};
