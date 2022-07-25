import { isDemoAsyncNode, AttributeType, NodeName } from 'common';

import { SliderTool } from 'notebookEditor/extension/shared/component/SliderTool';
import { getSelectedNode } from 'notebookEditor/extension/util/node';
import { EditorToolComponentProps } from 'notebookEditor/toolbar/type';

// ********************************************************************************
// == Constants ===================================================================
const SLIDER_MARK_VALUES = [{ value: 25, label: '2.5' }, { value: 50, label: '5' }, { value: 75, label: '7.5' }];

// == Component ===================================================================
interface Props extends EditorToolComponentProps {/*no additional*/ }
export const DemoAsyncNodeDelaySlider: React.FC<Props> = ({ editor, depth }) => {
  const { state } = editor;
  const node = getSelectedNode(state, depth);
  if(!node || !isDemoAsyncNode(node)) throw new Error('Invalid DemoAsyncNodeSlider render');

  // == Handlers ==================================================================
  const handleChange = (value: number) => {
    editor.commands.updateAttributes(NodeName.DEMO_ASYNCNODE, { delay: value * 100/*turns sliderValue to ms*/ });

    // Focus the editor again
    editor.chain().setNodeSelection(state.selection.$anchor.pos).focus().run();
  };

  // == UI ========================================================================
  return (
    <SliderTool
      name='Delay'
      value={node.attrs[AttributeType.Delay] / 100/*turns ms to sliderValue*/}
      step={10}
      sliderMarkValues={SLIDER_MARK_VALUES}
      onChange={handleChange}
    />
  );
};
