import { Box, Flex, Input } from '@chakra-ui/react';
import { useState, ChangeEventHandler, KeyboardEventHandler } from 'react';

import { useLocalValue } from 'notebookEditor/shared/hook/useLocalValue';
import { separateUnitFromString } from 'notebookEditor/theme/type';
import { TOOL_ITEM_DATA_TYPE } from 'notebookEditor/toolbar/type';

// ********************************************************************************
interface Props {
  name: string;
  initialInputValue: string;
  inputPlaceholder: string;
  onChange: (newValue: string) => void;
}

export const InputTool: React.FC<Props> = ({ name, initialInputValue, inputPlaceholder, onChange }) => {
  // == State =====================================================================
  const [inputColor, setInputColor] = useState('#000')/*default*/;
  const { commitChange, localValue, resetLocalValue, updateLocalValue } = useLocalValue<string>(initialInputValue, onChange);
  let [value] = separateUnitFromString(localValue);

  // == Handler ===================================================================
  const handleValueChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newValue = event.target.value;
    updateLocalValue(`${newValue}`);
  };

  const saveChange = () => {
    if(value) commitChange();
    else resetLocalValue();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    // Save changes when user presses enter
    if(event.key === 'Enter') {
      saveChange();

      setInputColor('green');
      setTimeout(() => {
        setInputColor('#000')/*default*/;
      }, 1000/*ms*/);

    }/* else -- ignore */
  };

  // == UI ========================================================================
  return (
    <Box>
      {name}
      <Flex marginTop='5px'>
        <Input
          value={localValue}
          size='sm'
          autoComplete='off'
          marginBottom='5px'
          placeholder={inputPlaceholder}
          color={inputColor}
          datatype={TOOL_ITEM_DATA_TYPE/*(SEE: notebookEditor/toolbar/type )*/}
          onBlur={saveChange}
          onChange={handleValueChange}
          onKeyDown={handleKeyDown}
        />
      </Flex>
    </Box>
  );
};
