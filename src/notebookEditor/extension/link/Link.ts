import { Mark, markPasteRule, mergeAttributes } from '@tiptap/core';
import { find, registerCustomProtocol } from 'linkifyjs';

import { LinkMarkSpec, LinkOptions, SetAttributeType, DEFAULT_LINK_CLASS, DEFAULT_LINK_HREF, DEFAULT_LINK_PROTOCOLS, DEFAULT_LINK_REL, DEFAULT_LINK_TARGET, DEFAULT_LINK_VALIDATE } from 'common';

import { DialogStorage } from 'notebookEditor/model/DialogStorage';

import { setAttributeParsingBehavior } from '../util/attribute';
import { setLinkCommand, toggleLinkCommand, unsetLinkCommand } from './command';
import { linkCreate } from './plugin/linkCreate';
import { linkClick } from './plugin/linkClick';
import { linkPaste } from './plugin/linkPaste';

// ********************************************************************************
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-link/src/link.ts

// == Mark ========================================================================
export const Link = Mark.create<LinkOptions, DialogStorage>({
  ...LinkMarkSpec,

  // -- Attribute -----------------------------------------------------------------
  addAttributes() {
    return {
      href: setAttributeParsingBehavior('href', SetAttributeType.STRING, DEFAULT_LINK_HREF),
      target: setAttributeParsingBehavior('target', SetAttributeType.STRING, DEFAULT_LINK_TARGET),
    };
  },
  addOptions() {
    return {
      protocols: DEFAULT_LINK_PROTOCOLS,
      HTMLAttributes: {
        rel: DEFAULT_LINK_REL,
        class: DEFAULT_LINK_CLASS,
      },
      validate: DEFAULT_LINK_VALIDATE,
    };
  },

  // -- Command -------------------------------------------------------------------
  addCommands() {
    return {
      setLink: setLinkCommand,
      toggleLink: toggleLinkCommand,
      unsetLink: unsetLinkCommand,
    };
  },

  // -- Storage -------------------------------------------------------------------
  addStorage() { return new DialogStorage(); },

  // -- Plugin --------------------------------------------------------------------
  addProseMirrorPlugins() { return [linkCreate(this.options.validate), linkClick(), linkPaste(this.editor)]; },

  // -- Create --------------------------------------------------------------------
  onCreate() { this.options.protocols.forEach(registerCustomProtocol); },
  // -- Paste ---------------------------------------------------------------------
  addPasteRules() {
    return [
      markPasteRule({
        find: (text) => find(text)
          .filter(link => {
            if(this.options.validate)
              return this.options.validate(link.value);
            /* else -- there is no custom validate logic, allow the link */

            return true;
          })
          .filter(link => link.isLink)
          .map(link => ({
            text: link.value,
            index: link.start,
            data: link,
          })),
        type: this.type,
        getAttributes: (match) => ({ href: match.data?.href }),
      }),
    ];
  },

  // -- View ----------------------------------------------------------------------
  parseHTML() { return [ { tag: 'a[href]:not([href *= "javascript:" i])' } ]; },
  renderHTML({ HTMLAttributes }) { return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes/*add attrs to pasted html*/), 0 ]; },
});
