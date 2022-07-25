import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';

import { noNodeSpecAttributeDefaultValue, AttributesTypeFromNodeSpecAttributes, AttributeType } from '../attribute';
import { NodeRendererSpec } from '../htmlRenderer/type';
import { NodeIdentifier, NodeName } from '../node';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
// -- Attribute -------------------------------------------------------------------
export const MIN_CELL_WIDTH = 25/*px*/;
export const CELL_ROW_SPAN = 1/*px*/;
export const CELL_COL_SPAN = 1/*px*/;

// NOTE: This values must have matching types the ones defined in the Extension.
const CellAttributeSpec = {
  // FIXME: ID attribute is here just to prevent type error, not in extension
  [AttributeType.Id]: noNodeSpecAttributeDefaultValue<NodeIdentifier>(),

  colspan: noNodeSpecAttributeDefaultValue<number>(),
  rowspan: noNodeSpecAttributeDefaultValue<number>(),
  colwidth: noNodeSpecAttributeDefaultValue<number>(),
};
export type CellAttributes = AttributesTypeFromNodeSpecAttributes<typeof CellAttributeSpec>;

// ================================================================================
// -- Node Spec -------------------------------------------------------------------
export const CellNodeSpec: NodeSpec = {
  name: NodeName.CELL,
  content: 'block+',
  tableRole: NodeName.CELL,
  isolating: true,
};

// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way since PM does not provide a way to specify the type
//       of the attributes
export type CellNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: CellAttributes; };
export const isCellNode = (node: ProseMirrorNode<NotebookSchemaType>): node is CellNodeType => node.type.name === NodeName.CELL;

// ================================================================================
// -- Render Spec -----------------------------------------------------------------
export const CellNodeRendererSpec: NodeRendererSpec<CellAttributes> = {
  tag: 'div',
  attributes: {/*TODO: Add attributes*/},
};
