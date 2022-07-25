import { CommandProps } from '@tiptap/core';

import { LinkAttributes, MarkName, PREVENT_LINK_META } from 'common';

// ********************************************************************************
// == Type ========================================================================
// NOTE: Usage of ambient module to ensure command is TypeScript-registered
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    [MarkName.LINK/*Expected and guaranteed to be unique. (SEE: /notebookEditor/model/node)*/]: {
      /** Set a link mark */
      setLink: (attributes: LinkAttributes) => ReturnType;

      /** Toggle a link mark */
      toggleLink: (attributes: LinkAttributes) => ReturnType;

      /** Unset a link mark */
      unsetLink: () => ReturnType;
    };
  }
}

// == Implementation ==============================================================
export const setLinkCommand = (attributes: LinkAttributes) => ({ chain }: CommandProps) =>
    chain()
    .setMark(MarkName.LINK, attributes)
    .setMeta(PREVENT_LINK_META, true)
    .run();

export const toggleLinkCommand = (attributes: LinkAttributes) => ({ chain }: CommandProps) =>
      chain()
      .toggleMark(MarkName.LINK, attributes, { extendEmptyMarkRange: true })
      .setMeta(PREVENT_LINK_META, true)
      .run();

export const unsetLinkCommand = () => ({ chain }: CommandProps) =>
    chain()
    .unsetMark(MarkName.LINK, { extendEmptyMarkRange: true })
    .setMeta(PREVENT_LINK_META, true)
    .run();
