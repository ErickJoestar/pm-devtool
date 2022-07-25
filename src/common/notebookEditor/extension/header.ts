import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';

import { noNodeSpecAttributeDefaultValue, AttributesTypeFromNodeSpecAttributes, AttributeType } from '../attribute';
import { NodeRendererSpec } from '../htmlRenderer/type';
import { NodeIdentifier, NodeName } from '../node';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
// -- Attribute -------------------------------------------------------------------
export const HEADER_ROW_SPAN = 1/*px*/;
export const HEADER_COL_SPAN = 1/*px*/;

// NOTE: This values must have matching types the ones defined in the Extension.
const HeaderAttributeSpec = {
  // FIXME: ID attribute is here just to prevent type error, not in extension
  [AttributeType.Id]: noNodeSpecAttributeDefaultValue<NodeIdentifier>(),

  colspan: noNodeSpecAttributeDefaultValue<number>(),
  rowspan: noNodeSpecAttributeDefaultValue<number>(),
  colwidth: noNodeSpecAttributeDefaultValue<number>(),
};
export type HeaderAttributes = AttributesTypeFromNodeSpecAttributes<typeof HeaderAttributeSpec>;

// ================================================================================
// -- Node Spec -------------------------------------------------------------------
export const HeaderNodeSpec: NodeSpec = {
  name: NodeName.HEADER,
  content: 'block+',
  // NOTE: The tableRole -must- have a different name than the node name
  // NOTE: The Header -must- have -this- role (header_cell)
  //       so that PM commands work correctly specifically, toggleHeaderRow,
  //       toggleHeaderColumn and toggleHeaderCell
  tableRole: `${NodeName.HEADER}_${NodeName.CELL}`,
  isolating: true,
};

// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way since PM does not provide a way to specify the type
//       of the attributes
export type HeaderNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: HeaderAttributes; };
export const isHeaderNode = (node: ProseMirrorNode<NotebookSchemaType>): node is HeaderNodeType => node.type.name === NodeName.HEADER;

// ================================================================================
// -- Render Spec -----------------------------------------------------------------
export const HeaderNodeRendererSpec: NodeRendererSpec<HeaderAttributes> = {
  tag: 'div',
  attributes: {/*TODO: Add attributes*/},
};
