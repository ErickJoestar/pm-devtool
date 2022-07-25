import { isDemo2AsyncNode, NodeName } from 'common';

import { InputTool } from 'notebookEditor/extension/shared/component/InputTool';
import { EditorToolComponentProps } from 'notebookEditor/toolbar/type';

// ********************************************************************************
interface Props extends EditorToolComponentProps {/*no additional*/}
export const Demo2AsyncNodeReplaceTextToolItem: React.FC<Props> = ({ editor }) => {
  const parentNode = editor.state.selection.$anchor.parent;
  if(!isDemo2AsyncNode(parentNode)) throw new Error('Invalid Demo2AsyncNode ReplaceTextToolItem Render');

  const { attrs } = parentNode;

  return (
    <InputTool
      name='Replace'
      initialInputValue={attrs.replaceText}
      inputPlaceholder={'Text to replace'}
      onChange={(newValue) => editor.chain().focus().updateAttributes(NodeName.DEMO2_ASYNCNODE, { replaceText: newValue.trim() }).run() }
    />
  );
};
