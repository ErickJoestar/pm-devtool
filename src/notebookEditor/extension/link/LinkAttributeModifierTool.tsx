import { Box, Select, Text } from '@chakra-ui/react';
import { Editor } from '@tiptap/core';
import { ReactNode } from 'react';

import { MarkName } from 'common';

import { InputTool } from '../style/component/InputTool';

// ********************************************************************************
// ================================================================================
type MarkAttributeModifierType = 'input' | 'select';
type MarkAttributeModifier = {
  name: string;
  initialValue: string;
  placeholder?: string;
  options?: string[];
  type: MarkAttributeModifierType;
  onChangeCallback: (updatedValue: string) => void;
};
interface Props {
  editor: Editor;
  markName: MarkName;
  markAttributeModifiers: MarkAttributeModifier[];
}
export const MarkAttributeModifierTool = ({ editor, markName, markAttributeModifiers }: Props) =>
  <>
    <Text
      as='strong'
      textTransform='capitalize'
      fontSize='15px'
    >
      {markName}
    </Text>
    {markAttributeModifiers.map((modifier, modifierIndex) => getMarkModifierComponent(modifier, modifierIndex))}
  </>;

const getMarkModifierComponent = (modifier: MarkAttributeModifier, modifierIndex: number): ReactNode => {
  switch(modifier.type) {
    case 'input':
      return (
        <InputTool
          key={modifierIndex}
          name={modifier.name}
          initialInputValue={modifier.initialValue}
          inputPlaceholder={modifier.placeholder ?? ''}
          onChange={(updatedValue) => modifier.onChangeCallback(updatedValue)}
        />
      );
    case 'select':
      if(!modifier.options)
        throw new Error('Select Mark Modifier did not receive options');

      return (
        <Box key={modifierIndex}>
          <Text>{modifier.name}</Text>
          <Select
            value={modifier.initialValue}
            size='sm'
            marginTop='5px'
            onChange={(event) => modifier.onChangeCallback(event.target.value)}
          >
            {modifier.options.map((option, optionIndex) => <option key={optionIndex}>{option}</option>)}
          </Select>
        </Box>
      );
  }
};
