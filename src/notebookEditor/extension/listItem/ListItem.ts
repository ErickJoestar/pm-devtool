import { Node } from '@tiptap/core';

import { ListItemNodeSpec, NodeName } from 'common';

import { NoOptions, NoStorage } from 'notebookEditor/model/type';
import { getNodeOutputSpec } from '../util/attribute';

import { safeParseTag } from '../util/parse';

// ********************************************************************************
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-list-item/src/list-item.ts

// == Node ========================================================================
export const ListItem = Node.create<NoOptions, NoStorage>({
  ...ListItemNodeSpec,

  // -- Command -------------------------------------------------------------------
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(NodeName.LIST_ITEM),
      Tab: () => this.editor.commands.sinkListItem(NodeName.LIST_ITEM),
      'Shift-Tab': () => this.editor.commands.liftListItem(NodeName.LIST_ITEM),
    };
  },

  // -- View ----------------------------------------------------------------------
  // FIXME: Style attrs not getting applied to tag
  parseHTML() { return [safeParseTag('li')]; },
  renderHTML({ node, HTMLAttributes }) { return getNodeOutputSpec(node, {/*no options*/}, false/*not a leaf node*/); },
});
