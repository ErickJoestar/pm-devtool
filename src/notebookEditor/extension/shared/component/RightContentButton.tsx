import { Editor } from '@tiptap/core';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { ReactElement } from 'react';

// ********************************************************************************
interface Props {
  editor: Editor;
  tooltip: string;
  isDisabled: boolean;
  icon: ReactElement;
  clickCallback: () => void;
}
export const RightContentButton: React.FC<Props> = ({ editor, tooltip, isDisabled, icon, clickCallback }) =>
  <Tooltip label={tooltip}>
    <IconButton
      marginY='5px'
      marginLeft='10px'
      variant='ghost'
      size='xs'
      icon={icon}
      isDisabled={isDisabled}
      rounded={100}
      aria-label='executeAsyncNodeButton'
      onClick={clickCallback}
    />
  </Tooltip>;
