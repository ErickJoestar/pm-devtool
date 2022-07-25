import { NodeName } from 'common';

import { markBold } from 'notebookEditor/extension/bold/toolbar';
import { bulletList } from 'notebookEditor/extension/bulletList/toolbar';
import { heading1, heading2, heading3 } from 'notebookEditor/extension/heading/toolbar';
import { orderedList } from 'notebookEditor/extension/orderedList/toolbar';
import { fontSizeToolItem, spacingToolItem, textColorToolItem } from 'notebookEditor/extension/textStyle/toolbar';
import { Toolbar } from 'notebookEditor/toolbar/type';


//*********************************************************************************
// == Toolbar =====================================================================
export const ParagraphToolbar: Toolbar = {
  nodeName: NodeName.PARAGRAPH/*Expected and guaranteed to be unique.*/,

  toolsCollections: [
    [
      orderedList,
      bulletList,
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
