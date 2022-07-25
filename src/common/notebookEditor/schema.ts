import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model';

import { BoldMarkSpec } from './extension/bold';
import { CellNodeSpec } from './extension/cell';
import { DocumentNodeSpec } from './extension/document';
import { HeaderNodeSpec } from './extension/header';
import { HeadingNodeSpec } from './extension/heading';
import { ParagraphNodeSpec } from './extension/paragraph';
import { RowNodeSpec } from './extension/row';
import { TableNodeSpec } from './extension/table';
import { TextNodeSpec } from './extension/text';
import { TextStyleMarkSpec } from './extension/textStyle';
import { MarkName } from './mark';
import { NodeName } from './node';

// ********************************************************************************
// ================================================================================
export const NodeSpecs: Record<NodeName, NodeSpec> = {
  [NodeName.CELL]: CellNodeSpec,
  [NodeName.DOC]: DocumentNodeSpec,
  [NodeName.HEADER]: HeaderNodeSpec,
  [NodeName.HEADING]: HeadingNodeSpec,
  [NodeName.ROW]: RowNodeSpec,
  [NodeName.PARAGRAPH]: ParagraphNodeSpec,
  [NodeName.TABLE]: TableNodeSpec,
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
