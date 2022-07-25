import { isDemoAsyncNode, swap, AttributeType, NodeName } from 'common';

import { isValidCodeBlockReference, visualIdsFromCodeBlockReferences } from 'notebookEditor/extension/codeBlockAsyncNode/util';
import { ChipDraggableItem } from 'notebookEditor/extension/shared/component/chipTool/Chip';
import { ChipTool } from 'notebookEditor/extension/shared/component/chipTool/ChipTool';
import { isNodeSelection } from 'notebookEditor/extension/util/node';
import { EditorToolComponentProps } from 'notebookEditor/toolbar/type';

// ********************************************************************************
interface Props extends EditorToolComponentProps {/*no additional*/}
export const DemoAsyncNodeChipSelector: React.FC<Props> = ({ editor }) => {
  const { selection } = editor.state;
  if(!isNodeSelection(selection) || !isDemoAsyncNode(selection.node)) throw new Error('Invalid DemoAsyncNodeChipTool render');

  const { attrs } = selection.node;
  const selectedChips = visualIdsFromCodeBlockReferences(editor, attrs[AttributeType.CodeBlockReferences]);

  // == Handlers ==================================================================
  const handleChipsInputUpdate = (codeBlockVisualId: string) => {
    const codeBlockReference = isValidCodeBlockReference(editor, attrs, codeBlockVisualId);
    if(!codeBlockReference.isValid) return false/*ignore call*/;

    return editor.chain()
                 .updateAttributes(NodeName.DEMO_ASYNCNODE, { ...attrs, codeBlockReferences: [...attrs.codeBlockReferences, codeBlockReference.codeBlockId] })
                 .setNodeSelection(selection.$anchor.pos)
                 .run();
  };

  const handleChipDrop = ({ id, index }: ChipDraggableItem) => {
    const movedPosition = Number(id),
          destinationPosition = Number(index);
    const newCodeBlockReferences: string[] = [...attrs.codeBlockReferences];

    // move codeBlockReference in movedPosition to destinationPosition by swapping
    swap(newCodeBlockReferences, movedPosition, destinationPosition);

    return editor.chain()
              .focus()
              .updateAttributes(NodeName.DEMO_ASYNCNODE, { ...attrs, codeBlockReferences: newCodeBlockReferences })
              .setNodeSelection(selection.$anchor.pos)
              .run();
  };

  const handleChipClose = (deletedIndex: number) => {
    let newCodeBlockReferences = [...attrs.codeBlockReferences];
        newCodeBlockReferences.splice(deletedIndex, 1);

    return editor.chain()
              .focus()
              .updateAttributes(NodeName.DEMO_ASYNCNODE, { ...attrs, codeBlockReferences: newCodeBlockReferences })
              .setNodeSelection(selection.$anchor.pos)
              .run();
  };

  // == UI ========================================================================
  return (
    <ChipTool
      name='Referenced CodeBlocks'
      width='100%'
      marginTop='10px'
      currentChips={selectedChips}
      updateChipsInputCallback={handleChipsInputUpdate}
      chipDropCallback={handleChipDrop}
      chipCloseButtonCallback={handleChipClose}
    />
  );
};
