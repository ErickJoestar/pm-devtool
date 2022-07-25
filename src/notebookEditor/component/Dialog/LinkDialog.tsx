import { Editor } from '@tiptap/react';

import { createDefaultLinkMarkAttributes } from 'common/notebookEditor/extension/link';

import { Dialog } from './Dialog';

// ********************************************************************************
interface Props {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}
export const LinkDialog: React.FC<Props> = ({ editor, isOpen, onClose }) => {
  // == Handler ===================================================================
  const addLinkCallback = (inputValue: string) => {
    try {
      const { empty } = editor.state.selection,
            linkAttrs = { ...createDefaultLinkMarkAttributes(), href: inputValue.trim() };

      const { $anchor, $head } = editor.state.selection,
            finalSelection = $anchor.pos > $head.pos ? $anchor.pos : $head.pos;

      empty
        ? editor.chain()
                .toggleLink(linkAttrs)
                .insertContent(inputValue)
                .unsetLink()
                .run()
        : editor.chain().setLink(linkAttrs).setTextSelection(finalSelection).run();
    } catch(error) {
      console.warn(`Error while inserting link: ${error}`);
    } finally {
      onClose();
    }
  };

  // == UI ========================================================================
  return (
    <Dialog
      dialogTitle={'Add a Link'}
      inputPlaceholder={'Paste a Link...'}
      buttons={[
        {
          text: 'Cancel',
          onClick: () => onClose(),
        },
        {
          text: 'Insert',
          onClick: (inputValue) => addLinkCallback(inputValue),
        },
      ]}
      enterCallback={(inputValue) => addLinkCallback(inputValue)}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};
