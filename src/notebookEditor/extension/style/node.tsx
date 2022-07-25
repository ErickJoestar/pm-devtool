import { FiImage } from 'react-icons/fi';

import { NodeName } from 'common';
import { getDialogStorage } from 'notebookEditor/model/DialogStorage';
import { ToolItem } from 'notebookEditor/toolbar/type';

// ********************************************************************************
// ================================================================================
export const image: ToolItem = {
  toolType: 'button',

  name: NodeName.IMAGE,
  label: NodeName.IMAGE,

  icon: <FiImage size={16} />,
  tooltip: 'Add an Image',

  shouldBeDisabled: (editor) => editor.isActive(NodeName.IMAGE),
  shouldShow: (editor) => editor.isActive(NodeName.PARAGRAPH),
  onClick: (editor) => {
    const imageStorage = getDialogStorage(editor, NodeName.IMAGE);
    if(!imageStorage) return/*nothing to do*/;

    imageStorage.setShouldInsertNodeOrMark(true);
    editor.commands.focus()/*trigger editor update by focusing it*/;
  },
};
