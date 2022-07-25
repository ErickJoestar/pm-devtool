import { getAttributes } from '@tiptap/core';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';

import { NotebookSchemaType, MarkName } from 'common';
import { NoPluginState } from 'notebookEditor/model/type';
import { isValidHTMLElement } from 'notebookEditor/extension/util/parse';
import { CLICKABLE_CLASS } from 'notebookEditor/theme/theme';

import { sanitizeLinkInput } from '../util';

// ********************************************************************************
// REF: https://github.com/ProseMirror/prosemirror-tables/blob/master/src/columnresizing.js
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-link/src/helpers/clickHandler.ts

// == Type ========================================================================
type LinkClickMeta = { shouldSetClickable: boolean; };

// == Class =======================================================================
class LinkClick {
  constructor(public shouldSetClickable: boolean ) { this.shouldSetClickable = shouldSetClickable; }

  apply(tr: Transaction, thisPluginState: LinkClick, oldEditorState: EditorState, newEditorState: EditorState) { /*produce a new plugin state*/
    const { shouldSetClickable } = getLinkClickMeta(tr);
    this.shouldSetClickable = shouldSetClickable;
    return this;
  }
}

// == Plugin ======================================================================
const linkClickKey = new PluginKey<NoPluginState, NotebookSchemaType>('linkClickKey');
export const linkClick = (): Plugin => {
  return new Plugin({
    // -- Setup -------------------------------------------------------------------
    key: linkClickKey,

    // -- State -------------------------------------------------------------------
    state: {
      init(_, state) { return new LinkClick(false/*default pointer not set*/); },
      apply(transaction, thisPluginState, oldState, newState) { return thisPluginState.apply(transaction, thisPluginState, oldState, newState); },
    },

    props: {
      // Ensures that a click on a link opens said link -only- if the CtrlKey or the
      // CmdKey are pressed when clicking said link
      handleClick: (view, pos, event) => {
        const { target } = event;
        if(!ctrlCmdPressed(event) || !isValidHTMLElement(target)) return false;

        const attrs = getAttributes(view.state, MarkName.LINK),
              link = target.closest('a');
        if(!link || !attrs.href) return false;

        window.open(sanitizeLinkInput(attrs.href), attrs.target);
        return true;
      },

      // Ensures that the cursor is set to 'pointer' when the user has the cmd
      // or ctrl keys pressed and is hovering over text that has a link mark
      handleDOMEvents: {
        // NOTE: Return value is false on both cases because the change is only
        //       meant to be visual (adding the class)
        mousemove(view, event) {
          if(!isSetClickableEvent(event)) {
            view.dispatch(view.state.tr.setMeta(linkClickKey, { shouldSetClickable: false }));
            return false;
          } /* else -- cmd/ctrl pressed over and user is hovering over an a tag */

          view.dispatch(view.state.tr.setMeta(linkClickKey, { shouldSetClickable: true }));
          return false;
        },
      },

      // Add the cursor pointer class to the editor
      // view according to the plugin state
      attributes(state) {
        const { shouldSetClickable } = getLinkClickState(state);
        return shouldSetClickable
          ? { class: CLICKABLE_CLASS }
          : null;
      },
    },
  });
};

// == Util ========================================================================
// -- State -----------------------------------------------------------------------
const getLinkClickState = (state: EditorState<any>) => linkClickKey.getState(state) as LinkClick/*by contract*/;
const getLinkClickMeta = (tr: Transaction): LinkClickMeta => {
  const meta = tr.getMeta(linkClickKey);
  if(!isLinkClickMeta(meta)) return { shouldSetClickable: false/*by definition*/ };
  return meta;
};

// -- Element ---------------------------------------------------------------------
const hasLinkAncestor = (target: HTMLElement) => {
  let element: HTMLElement | null = target,
      hasLinkAncestor = false/*default*/;

  while(element.parentElement) {
    if(element.tagName.toLowerCase() === 'a')
      hasLinkAncestor = true;
    /* else -- do not change default */
    element = element.parentElement;
  }

  return hasLinkAncestor;
};

// -- Event -----------------------------------------------------------------------
const ctrlCmdPressed = (event: MouseEvent | KeyboardEvent) => event.ctrlKey || event.metaKey;
const isSetClickableEvent = (event: MouseEvent | KeyboardEvent) => ctrlCmdPressed(event) && isValidHTMLElement(event.target) && hasLinkAncestor(event.target);


// -- Type Guard ------------------------------------------------------------------
const isLinkClickMeta = (object: any): object is LinkClickMeta => object && 'shouldSetClickable' in object;
