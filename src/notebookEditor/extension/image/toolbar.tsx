import { Editor } from '@tiptap/core';

import { isImageNode, NodeName, IMAGE_SRC_MODIFIER_TOOL, IMAGE_ALT_MODIFIER_TOOL, IMAGE_TITLE_MODIFIER_TOOL, IMAGE_WIDTH_MODIFIER_TOOL, IMAGE_HEIGHT_MODIFIER_TOOL } from 'common';

import { Toolbar, ToolItem } from 'notebookEditor/toolbar/type';
import { getDialogStorage } from 'notebookEditor/model/DialogStorage';
import { FiImage } from 'react-icons/fi';

import { InputTool } from '../style/component/InputTool';
import { UnitPickerInput } from '../style/component/UnitPickerInput.tsx';
import { isNodeSelection } from '../util/node';
import { verticalAlignBottom, verticalAlignMiddle, verticalAlignTop } from '../style/toolbar';

//*********************************************************************************
// == Tool items ==================================================================
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

// == Toolbar =====================================================================
export const ImageToolbar: Toolbar = {
  nodeName: NodeName.IMAGE,

  toolsCollections: [
    [
      {
        toolType: 'component',
        name: IMAGE_SRC_MODIFIER_TOOL,
        component: ({ editor }) => {
          const { selection, prevPos } = validateSelection(editor, IMAGE_SRC_MODIFIER_TOOL);

          return (
            <InputTool
              name={'Source'}
              initialInputValue={selection.node.attrs.src}
              inputPlaceholder={'Modify Source'}
              onChange={(newValue) => editor.chain().updateAttributes(NodeName.IMAGE, { src: newValue }).setNodeSelection(prevPos).run()}
            />
          );
        },
        shouldShow: (editor) => editor.isActive(NodeName.IMAGE),
        shouldBeDisabled: (editor) => !editor.isActive(NodeName.IMAGE),
      },
      {
        toolType: 'component',
        name: IMAGE_ALT_MODIFIER_TOOL,
        component: ({ editor }) => {
          const { selection, prevPos } = validateSelection(editor, IMAGE_ALT_MODIFIER_TOOL);

          return (
            <InputTool
              name={'Alt'}
              initialInputValue={selection.node.attrs.alt ? selection.node.attrs.alt : ''}
              inputPlaceholder={'Modify Alt'}
              onChange={(newValue) => editor.chain().updateAttributes(NodeName.IMAGE, { alt: newValue }).setNodeSelection(prevPos).run()}
            />
          );
        },
        shouldShow: (editor) => editor.isActive(NodeName.IMAGE),
        shouldBeDisabled: (editor) => !editor.isActive(NodeName.IMAGE),
      },
      {
        toolType: 'component',
        name: IMAGE_TITLE_MODIFIER_TOOL,
        component: ({ editor }) => {
          const { selection, prevPos } = validateSelection(editor, IMAGE_WIDTH_MODIFIER_TOOL);

          return (
            <InputTool
              name={'Title'}
              initialInputValue={selection.node.attrs.title ? selection.node.attrs.title : ''}
              inputPlaceholder={'Modify Title'}
              onChange={(newValue) => editor.chain().updateAttributes(NodeName.IMAGE, { title: newValue }).setNodeSelection(prevPos).run()}
            />
          );
        },
        shouldShow: (editor) => editor.isActive(NodeName.IMAGE),
        shouldBeDisabled: (editor) => !editor.isActive(NodeName.IMAGE),
      },
      {
        toolType: 'component',
        name: IMAGE_WIDTH_MODIFIER_TOOL,
        component: ({ editor }) => {
          const { selection, prevPos } = validateSelection(editor, IMAGE_WIDTH_MODIFIER_TOOL);

          return (
            <UnitPickerInput
              name={'Width'}
              onChange={(newValue) => editor.chain().updateAttributes(NodeName.IMAGE, { width: Number(newValue) < 0 ? '0' : newValue }).setNodeSelection(prevPos).run()}
              valueWithUnit={selection.node.attrs.width}
            />
          );
        },
        shouldShow: (editor) => editor.isActive(NodeName.IMAGE),
        shouldBeDisabled: (editor) => !editor.isActive(NodeName.IMAGE),
      },
      {
        toolType: 'component',
        name: IMAGE_HEIGHT_MODIFIER_TOOL,
        component: ({ editor }) => {
          const { selection, prevPos } = validateSelection(editor, IMAGE_HEIGHT_MODIFIER_TOOL);

          return (
            <UnitPickerInput
              name={'Height'}
              onChange={(newValue) => editor.chain().updateAttributes(NodeName.IMAGE, { height: Number(newValue) < 0 ? '0' : newValue }).setNodeSelection(prevPos).run()}
              valueWithUnit={selection.node.attrs.height}
            />
          );
        },
        shouldShow: (editor) => editor.isActive(NodeName.IMAGE),
        shouldBeDisabled: (editor) => !editor.isActive(NodeName.IMAGE),
      },
    ],
    [
      verticalAlignTop,
      verticalAlignMiddle,
      verticalAlignBottom,
    ],
  ],
};

// == Util ========================================================================
const validateSelection = (editor: Editor, toolName: string) => {
  const { selection } = editor.state,
        prevPos = selection.$anchor.pos;
  if(!isNodeSelection(selection) || !isImageNode(selection.node)) throw new Error(`Invalid ${toolName} render`);

  return { selection, prevPos };
};
