import { NodeName } from 'common';

import { DocumentToolbar } from 'notebookEditor/extension/document/toolbar';
import { CellToolbar } from 'notebookEditor/extension/table/cell/toolbar';
import { HeaderToolbar } from 'notebookEditor/extension/table/header/toolbar';
import { HeadingToolbar } from 'notebookEditor/extension/heading/toolbar';
import { ParagraphToolbar } from 'notebookEditor/extension/paragraph/toolbar';
import { RowToolbar } from 'notebookEditor/extension/table/row/toolbar';
import { TableToolbar } from 'notebookEditor/extension/table/toolbar';

import { Toolbar } from './type';

// ********************************************************************************
// A collection of toolbars. Each Node can have its own toolbar, if its not defined
// in the collection nothing will be shown.
const TOOLBAR_MAP: Record<NodeName, Toolbar | null> = {
  [NodeName.DOC]: DocumentToolbar,
  [NodeName.TEXT]: null/*none*/,
  [NodeName.PARAGRAPH]: ParagraphToolbar,
  [NodeName.CELL]: CellToolbar,
  [NodeName.HEADER]: HeaderToolbar,
  [NodeName.ROW]: RowToolbar,
  [NodeName.TABLE]: TableToolbar,
  [NodeName.HEADING]: HeadingToolbar,
};

/**
 * Gets the corresponding toolbar for a given node
 * @param nodeName The name of the node whose toolbar is being asked for
 * @returns The corresponding toolbar object for the given node name
 */
export const getToolbar = (nodeName: NodeName): Toolbar | null => {
  let toolbar = TOOLBAR_MAP[nodeName];
  return toolbar;
};
