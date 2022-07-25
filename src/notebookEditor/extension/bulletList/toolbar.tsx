import { MdFormatListBulleted } from 'react-icons/md';

import { isParagraphNode, NodeName } from 'common';

import { isNodeSelection } from 'notebookEditor/extension/util/node';
import { ToolItem } from 'notebookEditor/toolbar/type';

// ********************************************************************************
// == Tool Items ==================================================================
export const bulletList: ToolItem = {
  toolType: 'button',
  name: NodeName.BULLET_LIST,
  label: NodeName.BULLET_LIST,

  icon: <MdFormatListBulleted size={16} />,
  tooltip: 'Bullet List (⌘ + Shift + 8)',

  shouldBeDisabled: (editor) => {
    const { selection } = editor.state;
    if(isNodeSelection(selection)) return true;
    if(isParagraphNode(selection.$anchor.parent)) return false;
    /* else -- selection somewhere that does not allow bullet list */

    return true;
  },
  shouldShow: (editor, depth) => depth === undefined || editor.state.selection.$anchor.depth === depth/*direct parent*/,
  onClick: (editor) => editor.chain().focus().toggleBulletList().run(),
};
