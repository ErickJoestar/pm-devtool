import { NodeName } from 'common';

import { markBold } from 'notebookEditor/extension/bold/toolbar';
import { heading1, heading2, heading3 } from 'notebookEditor/extension/heading/toolbar';
import { fontSizeToolItem, spacingToolItem, textColorToolItem } from 'notebookEditor/extension/textStyle/toolbar';
import { svg } from 'notebookEditor/extension/svg/toolbar/toolbar';
import { Toolbar } from 'notebookEditor/toolbar/type';

//*********************************************************************************
// == Toolbar =====================================================================
export const ParagraphToolbar: Toolbar = {
  nodeName: NodeName.PARAGRAPH/*Expected and guaranteed to be unique.*/,

  toolsCollections: [
    [
      svg,
      markBold,
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
