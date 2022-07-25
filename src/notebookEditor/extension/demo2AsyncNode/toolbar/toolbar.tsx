import { MdFindReplace } from 'react-icons/md';

import { NodeName } from 'common';

import { markBold } from 'notebookEditor/extension/bold/toolbar';
import { heading1, heading2, heading3 } from 'notebookEditor/extension/heading/toolbar';
import { fontSizeToolItem, spacingToolItem, textColorToolItem } from 'notebookEditor/extension/textStyle/toolbar';
import { parentIsOfType } from 'notebookEditor/extension/util/node';
import { Toolbar, ToolItem } from 'notebookEditor/toolbar/type';

import { Demo2AsyncNodeReplaceTextToolItem } from './Demo2AsyncNodeReplaceTextToolItem';
import { ExecuteDemo2AsyncNodeButton } from './ExecuteDemo2AsyncNodeButton';

//*********************************************************************************
// == Tool Items ==================================================================
export const demo2AsyncNodeToolItem: ToolItem = {
  toolType: 'button',
  name: NodeName.DEMO2_ASYNCNODE,
  label: NodeName.DEMO2_ASYNCNODE,

  icon: <MdFindReplace size={16} />,
  tooltip: 'Demo2AsyncNode (⌘ + Shift + Option + D)',

  shouldBeDisabled: () => false,
  shouldShow: (editor, depth) => depth === undefined || editor.state.selection.$anchor.depth === depth/*direct parent*/,
  onClick: (editor) => editor.chain().focus().toggleDemo2AsyncNode().run(),
};

const demo2AsyncNodeReplaceTextToolItem: ToolItem = {
  toolType: 'component',
  name: 'demo2AsyncNodeReplaceTextToolItem',

  component: Demo2AsyncNodeReplaceTextToolItem,
  shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.DEMO2_ASYNCNODE),
};

// == Toolbar =====================================================================
export const Demo2AsyncNodeToolbar: Toolbar = {
  nodeName: NodeName.DEMO2_ASYNCNODE/*Expected and guaranteed to be unique.*/,
  rightContent: ExecuteDemo2AsyncNodeButton,

  toolsCollections: [
    [
      demo2AsyncNodeReplaceTextToolItem,
    ],
    [
      markBold,
      heading1,
      heading2,
      heading3,
    ],
    [
      fontSizeToolItem,
      textColorToolItem,
    ],
    [
      spacingToolItem,
    ],
  ],
};
