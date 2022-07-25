import { isCodeBlockNode, NodeName } from 'common';

import { CheckboxTool } from 'notebookEditor/extension/shared/component/CheckBoxTool';
import { EditorToolComponentProps } from 'notebookEditor/toolbar/type';

// ********************************************************************************
interface Props extends EditorToolComponentProps {/*no additional*/}
export const CodeBlockWrapToolItem: React.FC<Props> = ({ editor }) => {
  const parentNode = editor.state.selection.$anchor.parent;
  if(!isCodeBlockNode(parentNode)) throw new Error('Invalid CodeBlock WrapTool Render');

  const { attrs } = parentNode;

  return (
    <CheckboxTool
      name='CodeBlockWrapToolItem'
      width='100%'
      marginTop='0'
      value={attrs.wrap}
      onChange={() => editor.chain().focus().updateAttributes(NodeName.CODEBLOCK, { wrap: !attrs.wrap }).setTextSelection(editor.state.selection.$anchor.pos).run()}
      checkName='Wrap'
    />
  );
};
