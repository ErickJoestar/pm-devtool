import { useEffect, useState } from 'react';

import { MarkName } from 'common';
import { getDialogStorage } from 'notebookEditor/model/DialogStorage';

import { LinkDialog } from './Dialog/LinkDialog';
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

  const linkStorage = getDialogStorage(editor, MarkName.LINK),
        shouldInsertLink = linkStorage?.getShouldInsertNodeOrMark();
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  // == Effects ===================================================================
  // Listen for editor storage to see if link should be inserted (SEE: Link.ts)
  useEffect(() => {
    if(!shouldInsertLink) return;

    setIsCreatingLink(true);
  }, [shouldInsertLink]);

  // == Effects ===================================================================
  /**
   * This effect handles shortcut listening for cases that are not specific to
   * the editor itself (e.g. showing dialogs)
   */
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      switch(event.code) {
        case 'KeyK': {
          if(!editor || !(event.ctrlKey || event.metaKey )) return;
          /* else -- ctrl/cmd + k keys pressed at the same time */

          event.preventDefault();
          // NOTE: This is needed to remove the focus of the editor so that
          //       the cursor is in the right position when the editor is
          //       focused back by closing the dialog
          if(document.activeElement instanceof HTMLElement)
            document.activeElement.blur();
          /* else -- do not blur */

          // NOTE: Check to see if link mark active right ahead. This would
          //       normally be checked for by the 'inclusive' property of the
          //       markSpec, but since its set to false (cause one would not)
          //       want the mark to be active after having inserted a link,
          //       (SEE: common/link.ts), this check has to be done
          const { $from } = editor.state.selection,
                linkMarkActive = editor.isActive(MarkName.LINK) || editor.state.doc.rangeHasMark($from.pos, $from.pos+1, editor.state.schema.marks[MarkName.LINK]);
          if(linkMarkActive) {
            editor.chain().focus().unsetLink().run();
            return;
          }/* else -- link mark not active, add a new one */

          setIsCreatingLink(true);
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
  const handleCloseLinkDialog = () => {
    if(!editor || !linkStorage) return;

    setIsCreatingLink(false);
    linkStorage.setShouldInsertNodeOrMark(false);
    setTimeout(() => editor.commands.focus(), 150/*after react-re-rendering*/);
  };

  // == UI ========================================================================
  if(!editor) return null/*nothing to do*/;

  return (
    <>
      <LinkDialog editor={editor} isOpen={isCreatingLink} onClose={handleCloseLinkDialog} />
    </>
  );
};
