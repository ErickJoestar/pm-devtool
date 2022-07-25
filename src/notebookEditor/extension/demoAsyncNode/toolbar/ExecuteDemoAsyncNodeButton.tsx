import { isDemoAsyncNode, NodeName } from 'common';

import { ExecuteAsyncNodeButton } from 'notebookEditor/extension/asyncNode/component/ExecuteAsyncNodeButton';
import { DemoAsyncNodeStorageType } from 'notebookEditor/extension/demoAsyncNode/nodeView/controller';
import { isNodeSelection } from 'notebookEditor/extension/util/node';
import { getNodeViewStorage } from 'notebookEditor/model/NodeViewStorage';
import { EditorToolComponentProps } from 'notebookEditor/toolbar/type';

// ********************************************************************************
interface Props extends EditorToolComponentProps {/*no additional*/}
export const ExecuteDemoAsyncNodeButton: React.FC<Props> = ({ editor }) => {
  const { selection } = editor.state;
  if(!isNodeSelection(selection) || !isDemoAsyncNode(selection.node)) throw new Error(`Invalid DemoAsyncNode executeButton render: ${selection}`);

  const { attrs } = selection.node;
  const demoAsyncNodeViewStorage = getNodeViewStorage<DemoAsyncNodeStorageType>(editor, NodeName.DEMO_ASYNCNODE),
        demoAsyncNodeView = demoAsyncNodeViewStorage.getNodeView(attrs.id);
  if(!demoAsyncNodeView) throw new Error(`demoAsyncNodeView does not exist: ${attrs.id}`);

  return (
  <ExecuteAsyncNodeButton
    editor={editor}
    asyncNodeView={demoAsyncNodeView}
    allowExecutionFunction={(asyncNodeView) => (!asyncNodeView.nodeModel.getPerformingAsyncOperation()) && asyncNodeView.node.attrs.codeBlockReferences.length > 0}
  />
  );
};
