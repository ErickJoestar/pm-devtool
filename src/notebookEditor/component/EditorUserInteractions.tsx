import { useEffect, useState } from 'react';

import { NodeName } from 'common';

import { getDialogStorage } from 'notebookEditor/model/DialogStorage';
import { ImageDialog } from './Dialog/ImageDialog';
import { useValidatedEditor } from 'notebookEditor/hook/useValidatedEditor';
import { isNodeSelection } from 'notebookEditor/extension/util/node';
import { isValidHTMLElement } from 'notebookEditor/extension/util/parse';
import { TOOL_ITEM_DATA_TYPE } from 'notebookEditor/toolbar/type';

// ********************************************************************************
/**
 * This component handles editor-related logic that requires the use of hooks
 * (and hence it must be a component)
 */
export const EditorUserInteractions = () => {
  // == State =====================================================================
  const editor  = useValidatedEditor();

  const imageStorage = getDialogStorage(editor, NodeName.IMAGE),
        shouldInsertImage = imageStorage?.getShouldInsertNodeOrMark();
  const [isCreatingImage, setIsCreatingImage] = useState(false);

  // == Effects ===================================================================
  // Listen for editor storage to see if image should be modified (SEE: Image.ts)
  useEffect(() => {
    if(!shouldInsertImage) return;

    setIsCreatingImage(true);
  }, [shouldInsertImage]);

  // == Effects ===================================================================
  /**
   * This effect handles shortcut listening for cases that are not specific to
   * the editor itself (e.g. showing dialogs)
   */
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      switch(event.code) {
        case 'KeyI': {
          if(!editor || !(event.ctrlKey /* NOTE: add back when not in dev  || event.metaKey */) || !event.altKey) return;
          /* else -- ctrl/cmd + option + i keys pressed at the same time */

          event.preventDefault();
          // NOTE: This is needed to remove the focus of the editor so that
          //       the cursor is in the right position when the editor is
          //       focused back by closing the dialog
          if(document.activeElement instanceof HTMLElement)
            document.activeElement.blur();
          /* else -- do not blur */

          setIsCreatingImage(true);
          break;
        }

        // Focus Sidebar on Cmd + Option + .
        case 'Period': {
          if(!(event.altKey && event.metaKey)) return/*nothing to do*/;

          const firstToolItem = [...document.querySelectorAll(`[datatype=${TOOL_ITEM_DATA_TYPE}]`)][0/*first one*/]/*necessary for type-guard below*/;
          if(!isValidHTMLElement(firstToolItem)) {
            console.warn('toolItem is not a valid HTML Element');
            return/*do nothing*/;
          }/* else -- valid html element */

          event.preventDefault();
          firstToolItem.focus();
          break;
        }

        // Focus editor on Cmd + Option + ,
        case 'Comma': {
          if(!(event.altKey && event.metaKey)) return;
          isNodeSelection(editor.state.selection)
            ? editor.commands.setNodeSelection(editor.state.selection.$anchor.pos)
            : editor.commands.focus();
          event.preventDefault();
          break;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editor]);


  // == Handlers ==================================================================
  const handleCloseImageDialog = () => {
    if(!editor || !imageStorage) return;

    setIsCreatingImage(false);
    imageStorage.setShouldInsertNodeOrMark(false);
    setTimeout(() => editor.commands.focus(), 150/*after react-re-rendering*/);
  };
  // Currently nothing

  // == UI ========================================================================
  if(!editor) return null/*nothing to do*/;

  return (
    <>
      <ImageDialog editor={editor} isOpen={isCreatingImage} onClose={handleCloseImageDialog} />
    </>
  );
};
