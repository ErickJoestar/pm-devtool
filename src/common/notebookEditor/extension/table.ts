import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';
import { NodeView } from 'prosemirror-view';

import { noNodeSpecAttributeDefaultValue, AttributeType, AttributesTypeFromNodeSpecAttributes } from '../attribute';
import { NodeRendererSpec } from '../htmlRenderer/type';
import { NodeIdentifier, NodeName } from '../node';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
export type TableOptions = {
  resizable: boolean;
  handleWidth: number;
  cellMinWidth: number;
  View: NodeView<NotebookSchemaType>;
  lastColumnResizable: boolean;
  allowTableNodeSelection: boolean;
}

// ================================================================================
// -- Attribute -------------------------------------------------------------------
export const TABLE_ID = 'Default Table ID'/*FIXME: Cannot import DEFAULT_NODE_ID from uniqueNodeId*/;

// NOTE: This values must have matching types the ones defined in the Extension.
const TableAttributeSpec = {
  [AttributeType.Id]: noNodeSpecAttributeDefaultValue<NodeIdentifier>(),
};
export type TableAttributes = AttributesTypeFromNodeSpecAttributes<typeof TableAttributeSpec>;

// ================================================================================
// -- Node Spec -------------------------------------------------------------------
export const TableNodeSpec: NodeSpec = {
  name: NodeName.TABLE,
  content: `${NodeName.ROW}+`,
  tableRole: NodeName.TABLE,
  isolating: true,
  group: 'block',
};

// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way since PM does not provide a way to specify the type
//       of the attributes
export type TableNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: TableAttributes; };
export const isTableNode = (node: ProseMirrorNode<NotebookSchemaType>): node is TableNodeType => node.type.name === NodeName.TABLE;

// ================================================================================
// -- Render Spec -----------------------------------------------------------------
export const TableNodeRendererSpec: NodeRendererSpec<TableAttributes> = {
  tag: 'div',
  attributes: {/*TODO: Add attributes*/},
};

// == Constant ====================================================================
// -- General ---------------------------------------------------------------------
export const HANDLE_DETECTION_AREA = 5/*px*/;

// -- Table -----------------------------------------------------------------------
// .. Attribute ...................................................................
export const TABLE_ROLE = 'tableRole';
export const TABLE_DEFAULT_ROWS = 3;
export const TABLE_DEFAULT_COLUMNS = 3;
export const TABLE_DEFAULT_WITH_HEDER_ROW = true;

// .. Class .......................................................................
export const TABLE_CONTAINER_CLASS = 'tableWrapper';
