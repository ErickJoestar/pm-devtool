import { Editor } from '@tiptap/react';
import { useState } from 'react';

import { createDefaultImageAttributes, fitImageDimension, getImageMeta, DEFAULT_IMAGE_SRC } from 'common';

import { Dialog } from './Dialog';

// ********************************************************************************
interface Props {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}
export const ImageDialog: React.FC<Props> = ({ editor, isOpen, onClose }) => {
  // == State =====================================================================
  const [isLoading, setIsLoading] = useState(false);

  // == Handler ===================================================================
  const addImageCallback = async (inputValue: string) => {
    try {
      setIsLoading(true);
      const img = await getImageMeta(inputValue ? inputValue : DEFAULT_IMAGE_SRC),
            { src, fittedWidth: width, fittedHeight: height } = fitImageDimension(img);
      editor.chain().focus().insertImage({ ...createDefaultImageAttributes(), src, width, height }).run();
    } catch(error) {
      console.warn(`Error while inserting image from URL: ${error}`);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  // == UI ========================================================================
  return (
    <Dialog
      dialogTitle={'Add an Image'}
      inputPlaceholder={'Paste URL of image...'}
      buttons={[
        {
          text: 'Cancel',
          onClick: () => onClose(),
          loading: false,
        },
        {
          text: 'Insert',
          onClick: (inputValue) => addImageCallback(inputValue),
          loading: isLoading,
        },
      ]}
      enterCallback={(inputValue) => addImageCallback(inputValue)}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};
