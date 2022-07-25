import { Node, mergeAttributes } from '@tiptap/core';

import { RowNodeSpec } from 'common';

import { safeParseTag } from 'notebookEditor/extension/util/parse';
import { NoOptions, NoStorage } from 'notebookEditor/model/type';

// ********************************************************************************
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table-row/src/table-row.ts

// == Node ========================================================================
export const Row = Node.create<NoOptions, NoStorage>({
  ...RowNodeSpec,

  // -- View ----------------------------------------------------------------------
  parseHTML() { return [safeParseTag('tr')]; },
  renderHTML({ HTMLAttributes }) { return ['tr', mergeAttributes(HTMLAttributes)/*add attrs to pasted html*/, 0]; },
});
