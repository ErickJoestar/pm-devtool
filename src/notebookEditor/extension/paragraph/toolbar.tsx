
import { NodeName } from 'common';

import { markBold } from 'notebookEditor/extension/bold/toolbar';
import { codeBlockToolItem } from 'notebookEditor/extension/codeblock/toolbar';
import { demoAsyncNodeToolItem } from 'notebookEditor/extension/demoAsyncNode/toolbar';
import { demo2AsyncNodeToolItem } from 'notebookEditor/extension/demo2AsyncNode/toolbar/toolbar';
import { heading1, heading2, heading3 } from 'notebookEditor/extension/heading/toolbar';
import { fontSizeToolItem, spacingToolItem, textColorToolItem } from 'notebookEditor/extension/textStyle/toolbar';
import { Toolbar } from 'notebookEditor/toolbar/type';


//*********************************************************************************
// == Toolbar =====================================================================
export const ParagraphToolbar: Toolbar = {
  nodeName: NodeName.PARAGRAPH/*Expected and guaranteed to be unique.*/,

  toolsCollections: [
    [
      demo2AsyncNodeToolItem,
      demoAsyncNodeToolItem,
      codeBlockToolItem,
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
