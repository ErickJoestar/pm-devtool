import { NodeName } from 'common';

import { Toolbar } from 'notebookEditor/toolbar/type';

import { CellToolbar } from '../cell/toolbar';

//*********************************************************************************
export const HeaderToolbar: Toolbar = {
  nodeName: NodeName.HEADER,
  toolsCollections: [...CellToolbar.toolsCollections/*same commands as a cell*/],
};
