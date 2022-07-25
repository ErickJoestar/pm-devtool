import { mergeAttributes, Node } from '@tiptap/core';

import { SetAttributeType, HeaderNodeSpec, HEADER_COL_SPAN, HEADER_ROW_SPAN } from 'common';

import { setAttributeParsingBehavior } from 'notebookEditor/extension/util/attribute';
import { safeParseTag } from 'notebookEditor/extension/util/parse';
import { NoOptions, NoStorage } from 'notebookEditor/model/type';

import { parseColWidthAttribute } from '../util';

// ********************************************************************************
// REF: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-table-header/src/table-header.ts

// == Node ========================================================================
export const Header = Node.create<NoOptions, NoStorage>({
  ...HeaderNodeSpec,

  // -- Attribute -----------------------------------------------------------------
  addAttributes() {
    return {
      colspan: setAttributeParsingBehavior('colspan', SetAttributeType.NUMBER, HEADER_COL_SPAN),
      rowspan: setAttributeParsingBehavior('colspan', SetAttributeType.NUMBER, HEADER_ROW_SPAN),
      colwidth: parseColWidthAttribute(),
    };
  },

  // -- View ----------------------------------------------------------------------
  parseHTML() { return [safeParseTag('th')]; },
  renderHTML({ HTMLAttributes }) { return ['th', mergeAttributes(HTMLAttributes)/*add attrs to pasted html*/, 0]; },
});
