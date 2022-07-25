import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';

import { NodeRendererSpec } from '../htmlRenderer/type';
import { NodeName } from '../node';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
// ================================================================================
// -- Node Spec -------------------------------------------------------------------
export const RowNodeSpec: NodeSpec = {
  name: NodeName.ROW,
  content: `(${NodeName.CELL} | ${NodeName.HEADER})*`,
  tableRole: NodeName.ROW,
};
type RowAttributes = {/*currently none*/};

// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way since PM does not provide a way to specify the type
//       of the attributes
export type RowNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: RowAttributes; };
export const isRowNode = (node: ProseMirrorNode<NotebookSchemaType>): node is RowNodeType => node.type.name === NodeName.ROW;

// ================================================================================
// -- Render Spec -----------------------------------------------------------------
export const RowNodeRendererSpec: NodeRendererSpec<RowAttributes> = {
  tag: 'div',
  attributes: {/*TODO: Add attributes*/},
};
