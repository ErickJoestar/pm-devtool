import { MarkName, NodeName } from 'common';

import { DocumentToolbar } from 'notebookEditor/extension/document';
import { ParagraphToolbar } from 'notebookEditor/extension/node/paragraph';

import { Toolbar } from './type';

// ********************************************************************************
// A collection of Toolbars. Each Node can have its own Toolbar. If it's not defined
// in the collection then nothing will be shown.
const TOOLBAR_MAP: Record<NodeName | MarkName, Toolbar | null> = {
  [NodeName.DOC]: DocumentToolbar,
  [NodeName.MARK_HOLDER]: null/*none*/,
  [NodeName.PARAGRAPH]: ParagraphToolbar,
  [NodeName.TEXT]: null/*none*/,
  [NodeName.HEADING]: null,

  [MarkName.BOLD]: null/*none*/,
};

// --------------------------------------------------------------------------------
/**
 * @param nodeOrMarkName The name of the node or mark whose toolbar is being asked for
 * @returns The corresponding Toolbar for the given Node name
 */
export const getToolbar = (nodeOrMarkName: NodeName | MarkName): Toolbar | null => {
  let toolbar = TOOLBAR_MAP[nodeOrMarkName];
  return toolbar;
};
