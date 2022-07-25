import { isDemo2AsyncNode, NodeName } from 'common';

import { ExecuteAsyncNodeButton } from 'notebookEditor/extension/asyncNode/component/ExecuteAsyncNodeButton';
import { getNodeViewStorage } from 'notebookEditor/model/NodeViewStorage';
import { EditorToolComponentProps } from 'notebookEditor/toolbar/type';

import { Demo2AsyncNodeStorageType } from '../nodeView/controller';

// ********************************************************************************
interface Props extends EditorToolComponentProps {/*no additional*/ }
export const ExecuteDemo2AsyncNodeButton: React.FC<Props> = ({ editor }) => {
  const parentNode = editor.state.selection.$anchor.parent;
  if(!isDemo2AsyncNode(parentNode)) throw new Error('Invalid ExecuteDemo2AsyncNodeButton Render');

  const demo2AsyncNodeViewStorage = getNodeViewStorage<Demo2AsyncNodeStorageType>(editor, NodeName.DEMO2_ASYNCNODE),
    demo2AsyncNodeView = demo2AsyncNodeViewStorage.getNodeView(parentNode.attrs.id);
  if(!demo2AsyncNodeView) throw new Error(`demo2AsyncNodeView does not exist: ${parentNode.attrs.id}`);

  return (
    <ExecuteAsyncNodeButton
      editor={editor}
      asyncNodeView={demo2AsyncNodeView}
      allowExecutionFunction={(asyncNodeView) => (asyncNodeView.node.attrs.replaceText.length > 0) && (demo2AsyncNodeView.node.textContent.length > 0)}
    />
  );
};
