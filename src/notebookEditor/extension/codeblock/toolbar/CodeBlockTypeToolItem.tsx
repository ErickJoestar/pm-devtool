import { isCodeBlockNode, CodeBlockType, NodeName } from 'common';

import { DropdownTool } from 'notebookEditor/extension/shared/component/DropdownTool';
import { EditorToolComponentProps } from 'notebookEditor/toolbar/type';

// ********************************************************************************
interface Props extends EditorToolComponentProps {/*no additional*/}
export const CodeBlockTypeToolItem: React.FC<Props> = ({ editor }) => {
  const parentNode = editor.state.selection.$anchor.parent;
  if(!isCodeBlockNode(parentNode)) throw new Error('Invalid CodeBlock WrapTool Render');

  const { attrs } = parentNode;

  return (
    <DropdownTool
      name='Type'
      width='100%'
      marginTop='0'
      value={attrs.type}
      options={[CodeBlockType.Code, CodeBlockType.Text]}
      onChange={(selectedOption) => editor.chain().focus().updateAttributes(NodeName.CODEBLOCK, { type: selectedOption }).setTextSelection(editor.state.selection.$anchor.pos).run()}
    />
  );
};
