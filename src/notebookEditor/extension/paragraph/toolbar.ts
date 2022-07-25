import { NodeName } from 'common';

import { markBold } from 'notebookEditor/extension/bold/toolbar';
import { heading1, heading2, heading3 } from 'notebookEditor/extension/heading/toolbar';
import { linkAttributeModifier, markLink } from 'notebookEditor/extension/link/toolbar';
import { fontSizeToolItem, spacingToolItem, textColorToolItem } from 'notebookEditor/extension/textStyle/toolbar';
import { Toolbar } from 'notebookEditor/toolbar/type';

//*********************************************************************************
// == Toolbar =====================================================================
export const ParagraphToolbar: Toolbar = {
  nodeName: NodeName.PARAGRAPH/*Expected and guaranteed to be unique.*/,

  toolsCollections: [
    [
      linkAttributeModifier,
    ],
    [
      markBold,
      markLink,
      heading1,
      heading2,
      heading3,
    ],
    [
      fontSizeToolItem,
      textColorToolItem,
    ],
    [
      spacingToolItem,
    ],
  ],
};
