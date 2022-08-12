import { Bold } from 'notebookEditor/extension/bold/Bold';
import { Document } from 'notebookEditor/extension/document/Document';
import { DropCursor } from 'notebookEditor/extension/dropCursor/DropCursor';
import { GapCursor } from 'notebookEditor/extension/gapcursor/GapCursor';
import { Heading } from 'notebookEditor/extension/heading/Heading';
import { Highlight } from 'notebookEditor/extension/highlight/Highlight';
import { History } from 'notebookEditor/extension/history/History';
import { InlineNodeWithContent } from 'notebookEditor/extension/inlineNodeWithContent/InlineNodeWithContent';
import { NodeViewRemoval } from 'notebookEditor/extension/nodeViewRemoval/NodeViewRemoval';
import { MarkHolder } from 'notebookEditor/extension/markHolder/MarkHolder';
import { Paragraph } from 'notebookEditor/extension/paragraph/Paragraph';
import { Strikethrough } from 'notebookEditor/extension/strikethrough/Strikethrough';
import { Style } from 'notebookEditor/extension/style/Style';
import { Text } from 'notebookEditor/extension/text/Text';
import { TextStyle } from 'notebookEditor/extension/textStyle/TextStyle';

import { EDITOR_CLASS_NAME, EDITOR_EDITABLE_CLASS_NAME } from './theme/theme';

// ********************************************************************************
// defines the structure of the Editor
// SEE: NotebookProvider
export const editorDefinition = {
  // NOTE: when adding or removing Extensions, the Schema must also be updated to
  //       reflect the new changes. It is used to validate the document and perform
  //       operations on the server-side and must be always be in sync
  // SEE: /common/notebookEditor/prosemirror/schema.ts
  extensions: [
    Bold,
    DropCursor,
    Document,
    GapCursor,
    Heading,
    Highlight,
    History,
    InlineNodeWithContent,
    NodeViewRemoval,
    MarkHolder,
    Paragraph,
    Strikethrough,
    Style,
    Text,
    TextStyle,
  ],
  editorProps: { attributes: { class: `${EDITOR_CLASS_NAME} ${EDITOR_EDITABLE_CLASS_NAME}`/*SEE: /index.css*/ } },

  autofocus: true/*initially has focus*/,
  content: ''/*initially empty*/,
};

// NOTE: the following execution order goes from top-first to bottom-last
// SEE: FeatureDoc, Changes section
//
// Current Schema Execution Order
// SEE: notebookEditor/model/type/ExtensionPriority
// appendedTransaction
// 1. UniqueNodeId
// 2. NodeViewRemoval
// 3. SetDefaultMarks
// 4. Paragraph
// 5. all other extensions (in registration order, (SEE: Extension array above))
//
// onTransaction
// 1. UniqueNodeId
// 2. NodeViewRemoval
// 3. SetDefaultMarks
// 4. Paragraph
// 5. all other extensions (in registration order, (SEE: Extension array above))
//
// onSelectionUpdate
// 1. UniqueNodeId
// 2. NodeViewRemoval
// 3. SetDefaultMarks
// 4. Paragraph
// 5. all other extensions (in registration order, (SEE: Extension array above))
//
// onUpdate
// 1. UniqueNodeId
// 2. NodeViewRemoval
// 3. SetDefaultMarks
// 4. Paragraph
// 5. all other extensions (in registration order, (SEE: Extension array above))
