import { BiCodeAlt } from 'react-icons/bi';

import { isCodeBlockNode, NodeName } from 'common';

import { parentIsOfType, selectionIsOfType } from 'notebookEditor/extension/util/node';
import { Toolbar, ToolItem } from 'notebookEditor/toolbar/type';

import { CodeBlockTypeToolItem } from './CodeBlockTypeToolItem';
import { CodeBlockWrapToolItem } from './CodeBlockWrapToolItem';

//*********************************************************************************
// === Tool Items =================================================================
export const codeBlockToolItem: ToolItem = {
  toolType: 'button',

  name: NodeName.CODEBLOCK,
  label: NodeName.CODEBLOCK,

  icon: <BiCodeAlt size={16} />,
  tooltip: 'CodeBlock (⌘ + ⌥ + C)',

  // Disable tool item if current selected node or its parent is a CodeBlock node
  shouldBeDisabled: (editor) => {
    const { selection } = editor.state;
    if(selectionIsOfType(selection, NodeName.CODEBLOCK)) return true;

    const parentNode = selection.$anchor.parent;
    if(isCodeBlockNode(parentNode)) return true;

    return false/*enabled*/;
  },
  onClick: (editor) => editor.chain().focus().toggleCodeBlock().run(),
};

const codeBlockTypeToolItem: ToolItem = {
  toolType: 'component',
  name: 'codeBlockTypeToolItem',

  component: CodeBlockTypeToolItem,
  shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.CODEBLOCK),
};

const codeBlockWrapToolItem: ToolItem =  {
  toolType: 'component',
  name: 'codeBlockWrapToolItem',

  component: CodeBlockWrapToolItem,
  shouldShow: (editor) => parentIsOfType(editor.state.selection, NodeName.CODEBLOCK),
};

// == Toolbar =====================================================================
export const CodeBlockToolbar: Toolbar = {
  nodeName: NodeName.CODEBLOCK,
  toolsCollections: [
    [
      codeBlockTypeToolItem,
      codeBlockWrapToolItem,
    ],
  ],
};
