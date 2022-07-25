import { EditorState, Transaction } from 'prosemirror-state';

// ********************************************************************************
// == Option & Storage ============================================================
export type NoOptions = never/*alias*/;
export type NoStorage = never/*alias*/;

// == Plugin ======================================================================
export class NoPluginState {
  constructor() {/*currently nothing*/ }
  apply(tr: Transaction, thisPluginState: NoPluginState, oldEditorState: EditorState, newEditorState: EditorState) { return this; }
}

// == Extension ===================================================================
export enum ExtensionName {
  ASYNC_NODE = 'asyncNode',
  CODEBLOCK_ASYNC_NODE = 'codeBlockAsyncNode',
  DROP_CURSOR = 'dropCursor',
  GAP_CURSOR = 'gapCursor',
  GAP_CURSOR_ALLOW = 'allowGapCursor'/*CHECK: is this the right place for this?*/,
  HIGHLIGHT = 'highlight',
  HISTORY = 'history',
  NODEVIEW_REMOVAL = 'nodeViewRemoval',
  UNIQUE_NODE_ID = 'uniqueNodeId',
  SET_DEFAULT_MARKS = 'setDefaultMarks',
  STYLE = 'style',
}

// == Priority ====================================================================
// NOTE: priority can affect extensions, nodes and marks
// NOTE: if priority is left unspecified, it defaults to 100
// NOTE: names match extension, node or mark names for sanity.
export enum ExtensionPriority {
  // -- Extension -----------------------------------------------------------------
  UNIQUE_NODE_ID = 120/*T&E*/,
  NODEVIEW_REMOVAL = 119,
  SET_DEFAULT_MARKS = 118,

  // -- Node ----------------------------------------------------------------------
  // NOTE: Paragraph must have a higher priority than other block nodes since it
  //       is the 'default' block node (by convention). If its priority is left
  //       unspecified, the default block node on document creation will be the
  //       first block node encountered in the editor extension array
  //       (SEE: notebookEditor/type.ts)
  PARAGRAPH = 117,

  // NOTE: Since codeBlockAsyncNodes are a subset of async nodes that can be
  //       dirty depending on whether or not specific criteria is met, the
  //       asyncNodes must check if they are dirty after the codeBlocks have
  //       been modified accordingly (e.g. codeBlockReferences and hashes) have
  //       been recomputed. Hence this must run before asyncNodes
  CODEBLOCK_ASYNC_NODE = 116,

  // NOTE: AsyncNodes effectively 'disable' the undo command while they are
  //       performing async operations. In order for the undo event (CMD-Z) to
  //       be handled before the history extension does its job
  //       (SEE: History.ts) they're given a higher priority than 100
  ASYNC_NODE = 115,

  // NOTE: Since the text extension adds a \t whenever Tab is pressed, but this
  //       behavior is not always guaranteed to be the desired one (e.g. when
  //       going through a list node), the text extension runs last (SEE: note
  //       above for default extension priority). This ensures that the shortcuts
  //       defined in the text extension run only if their trigger was not handled
  //       by another extension previously
  TEXT = 99,

  // -- Mark ----------------------------------------------------------------------
  // Currently nothing
}

// == Selection ===================================================================
// The depth of the selection from the current node.
// 0 is the base node, selection.depth is the parent node.
export type SelectionDepth = number | undefined/*current node*/;
