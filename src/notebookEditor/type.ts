import { Bold } from 'notebookEditor/extension/bold/Bold';
import { BulletList } from 'notebookEditor/extension/bulletList/BulletList';
import { Document } from 'notebookEditor/extension/document/Document';
import { DropCursor } from 'notebookEditor/extension/dropCursor/DropCursor';
import { GapCursor } from 'notebookEditor/extension/gapcursor/GapCursor';
import { Heading } from 'notebookEditor/extension/heading/Heading';
import { ListItem } from 'notebookEditor/extension/listItem/ListItem';
import { Highlight } from 'notebookEditor/extension/highlight/Highlight';
import { History } from 'notebookEditor/extension/history/History';
import { NodeViewRemoval } from 'notebookEditor/extension/nodeViewRemoval/NodeViewRemoval';
import { OrderedList } from 'notebookEditor/extension/orderedList/OrderedList';
import { Paragraph } from 'notebookEditor/extension/paragraph/Paragraph';
import { SetDefaultMarks } from 'notebookEditor/extension/setDefaultMarks/SetDefaultMarks';
import { Style } from 'notebookEditor/extension/style/Style';
import { TaskList } from 'notebookEditor/extension/taskList/TaskList';
import { Text } from 'notebookEditor/extension/text/Text';
import { TextStyle } from 'notebookEditor/extension/textStyle/TextStyle';
import { UniqueNodeId } from 'notebookEditor/extension/uniqueNodeId/UniqueNodeId';

// ********************************************************************************
// defines the structure of the Editor
// SEE: NotebookProvider
export const editorDefinition = {
  // NOTE: when adding or removing extensions you must also update the schema
  //       to reflect the new changes. It is used to validate the document and
  //       perform operations on the server-side and must be always be in sync.
  // see: src/common/notebookEditor/prosemirror/schema.ts.
  extensions: [ Bold, BulletList, DropCursor, Document, GapCursor, Heading, Highlight, History, ListItem, NodeViewRemoval, OrderedList, Paragraph, SetDefaultMarks, Style, TaskList, Text, TextStyle, UniqueNodeId ],
  editorProps: { attributes: { class: 'Editor'/*SEE: /index.css*/ } },

  autofocus: true/*initially has focus*/,
  content: ''/*initially empty*/,
};

//
/**
 * NOTE: The following execution order goes from top-first to bottom-last
 *       (SEE: FeatureDoc, Changes section)
 *
 * Current Schema Execution Order (SEE: notebookEditor/model/type/ExtensionPriority)
 * appendedTransaction
 * 1. UniqueNodeId
 * 2. NodeViewRemoval
 * 3. SetDefaultMarks
 * 4. Paragraph
 * 5. all other extensions (in registration order, (SEE: Extension array above))
 *
 * onTransaction
 * 1. UniqueNodeId
 * 2. NodeViewRemoval
 * 3. SetDefaultMarks
 * 4. Paragraph
 * 5. all other extensions (in registration order, (SEE: Extension array above))
 *
 * onSelectionUpdate
 * 1. UniqueNodeId
 * 2. NodeViewRemoval
 * 3. SetDefaultMarks
 * 4. Paragraph
 * 5. all other extensions (in registration order, (SEE: Extension array above))
 *
 * onUpdate
 * 1. UniqueNodeId
 * 2. NodeViewRemoval
 * 3. SetDefaultMarks
 * 4. Paragraph
 * 5. all other extensions (in registration order, (SEE: Extension array above))
 *
 */
