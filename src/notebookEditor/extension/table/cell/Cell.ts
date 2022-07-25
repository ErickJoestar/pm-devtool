import { mergeAttributes, Node } from '@tiptap/core';

import { CellNodeSpec, SetAttributeType, CELL_COL_SPAN, CELL_ROW_SPAN } from 'common';

import { setAttributeParsingBehavior } from 'notebookEditor/extension/util/attribute';
import { safeParseTag } from 'notebookEditor/extension/util/parse';
import { NoOptions, NoStorage } from 'notebookEditor/model/type';

import { parseColWidthAttribute } from '../util';

// ********************************************************************************
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table-cell/src/table-cell.ts

// == Node ========================================================================
export const Cell = Node.create<NoOptions, NoStorage>({
  ...CellNodeSpec,

  // -- Attribute -----------------------------------------------------------------
  addAttributes() {
    return {
      colspan: setAttributeParsingBehavior('colspan', SetAttributeType.NUMBER, CELL_COL_SPAN),
      rowspan: setAttributeParsingBehavior('rowspan', SetAttributeType.NUMBER, CELL_ROW_SPAN),
      colwidth: parseColWidthAttribute(),
    };
  },

  // -- View ----------------------------------------------------------------------
  parseHTML() { return [safeParseTag('td')]; },
  renderHTML({ HTMLAttributes }) { return ['td', mergeAttributes(HTMLAttributes)/*add attrs to pasted html*/, 0]; },
});
