import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model';

import { BoldMarkSpec } from './extension/bold';
import { BulletListNodeSpec } from './extension/bulletList';
import { DocumentNodeSpec } from './extension/document';
import { HeadingNodeSpec } from './extension/heading';
import { ListItemNodeSpec } from './extension/listItem';
import { OrderedListNodeSpec } from './extension/orderedList';
import { ParagraphNodeSpec } from './extension/paragraph';
import { TaskListNodeSpec } from './extension/taskList';
import { TextNodeSpec } from './extension/text';
import { TextStyleMarkSpec } from './extension/textStyle';
import { MarkName } from './mark';
import { NodeName } from './node';

// ********************************************************************************
// ================================================================================
export const NodeSpecs: Record<NodeName, NodeSpec> = {
  [NodeName.BULLET_LIST]: BulletListNodeSpec,
  [NodeName.DOC]: DocumentNodeSpec,
  [NodeName.HEADING]: HeadingNodeSpec,
  [NodeName.LIST_ITEM]: ListItemNodeSpec,
  [NodeName.ORDERED_LIST]: OrderedListNodeSpec,
  [NodeName.PARAGRAPH]: ParagraphNodeSpec,
  [NodeName.TASK_LIST]: TaskListNodeSpec,
  [NodeName.TEXT]: TextNodeSpec,
};

export const MarkSpecs: Record<MarkName, MarkSpec> = {
  [MarkName.BOLD]: BoldMarkSpec,
  [MarkName.TEXT_STYLE]: TextStyleMarkSpec,
};

// == Schema ======================================================================
// NOTE: This schema must reflect the same schema that is being used in the editor
//       itself, otherwise the editor will not be able to load the document.
//
//       When adding or removing nodes, the extensions that are used in the editor
//       must also be updated to match the new schema
// SEE: NotebookProvider.ts
export const SchemaV1 = new Schema({
  topNode: NodeName.DOC,

  nodes: NodeSpecs,

  marks: MarkSpecs,
});
export type NotebookSchemaType = typeof SchemaV1;
