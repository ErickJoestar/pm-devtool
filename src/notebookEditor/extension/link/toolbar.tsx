import { Editor, getMarkAttributes } from '@tiptap/core';
import { AiOutlineLink } from 'react-icons/ai';

import { isHeadingNode, isLinkMarkAttributes, isLinkTargetValue, isParagraphNode, LinkTargetValue, MarkName } from 'common';

import { getDialogStorage } from 'notebookEditor/model/DialogStorage';
import { ToolItem } from 'notebookEditor/toolbar/type';

import { isNodeSelection } from '../util/node';
import { MarkAttributeModifierTool } from './LinkAttributeModifierTool';

// ********************************************************************************
// == Tool Items ==================================================================
export const markLink: ToolItem = {
  toolType: 'button',

  name: MarkName.LINK,
  label: MarkName.LINK,

  icon: <AiOutlineLink size={16} />,
  tooltip: 'Link (⌘ + K)',

  shouldBeDisabled: (editor) => shouldLinkMarkBeDisabled(editor),
  shouldShow: (editor, depth) => depth === undefined || editor.state.selection.$anchor.depth === depth/*direct parent*/,
  onClick: (editor) => {
    const linkStorage = getDialogStorage(editor, MarkName.LINK);
    if(!linkStorage) return/*nothing to do*/;
    linkStorage.setShouldInsertNodeOrMark(true);
    editor.commands.focus()/*trigger editor update by focusing it*/;
  },
};
export const linkAttributeModifier: ToolItem = {
  toolType: 'component',

  name: MarkName.LINK,
  shouldBeDisabled: (editor) => shouldLinkMarkBeDisabled(editor),
  shouldShow: (editor) => editor.isActive(MarkName.LINK),
  component: ({ editor }) => {
    const attrs = getMarkAttributes(editor.state, MarkName.LINK);
    if(!isLinkMarkAttributes(attrs)) throw new Error(`Invalid attrs for linkAttributeModifier component render: ${JSON.stringify(attrs)}`);

    return (
      <MarkAttributeModifierTool
        editor={editor}
        markName={MarkName.LINK}
        markAttributeModifiers={
          [
            {
              name: 'URL',
              initialValue: attrs.href,
              placeholder: 'Modify URL',
              type: 'input',
              onChangeCallback: (updatedValue) => {
                const { pos: prevPos } = editor.state.selection.$anchor;
                editor.chain()
                      .extendMarkRange(MarkName.LINK)
                      .setLink({ ...attrs, href: updatedValue })
                      .setTextSelection(prevPos)
                      .run();
              },
            },
            {
              name: 'Target',
              initialValue: attrs.target,
              type: 'select',
              options: Object.values(LinkTargetValue),
              onChangeCallback: (updatedValue) => {
                if(updatedValue === attrs.target || !isLinkTargetValue(updatedValue)) return/*nothing to do*/;

                const { pos: prevPos } = editor.state.selection.$anchor;
                editor.chain()
                      .extendMarkRange(MarkName.LINK)
                      .setLink({ ...attrs, target: updatedValue })
                      .setTextSelection(prevPos)
                      .run();
              },
            },
          ]
        }
      />
    );
  },
};

// == Util ========================================================================
const shouldLinkMarkBeDisabled = (editor: Editor) => {
  const { selection } = editor.state;
  if(isNodeSelection(selection)) return true;
  if(isParagraphNode(selection.$anchor.parent) || isHeadingNode(selection.$anchor.parent)) return false;
  /* else -- selection somewhere that does not allow regular mark */
  return true;
};
