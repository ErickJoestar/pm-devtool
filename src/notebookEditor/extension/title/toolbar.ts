import { NodeName } from 'common';

import { Toolbar } from 'notebookEditor/toolbar/type';

import { markBold } from '../bold/toolbar';

//*********************************************************************************
export const TitleToolbar: Toolbar = {
  nodeName: NodeName.TITLE,

  toolsCollections: [[ markBold ]],
};
