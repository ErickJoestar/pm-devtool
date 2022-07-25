import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';

import { AttributesTypeFromNodeSpecAttributes } from '../attribute';
import { NodeRendererSpec } from '../htmlRenderer/type';
import { JSONNode, NodeName, NodeType } from '../node';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
// == Attribute ===================================================================
// NOTE: This values must have matching types the ones defined in the Extension.
const ListItemAttributeSpec = {/*no attributes*/};
export type ListItemAttributes = AttributesTypeFromNodeSpecAttributes<typeof ListItemAttributeSpec>

// == Spec ========================================================================
// -- Node Spec -------------------------------------------------------------------
export const ListItemNodeSpec: Readonly<NodeSpec> = {
  name: NodeName.LIST_ITEM/*expected and guaranteed to be unique*/,
  content: `${NodeName.PARAGRAPH} ${NodeType.BLOCK}*`,
  defining: true,
  attrs: ListItemAttributeSpec,
};

// -- Render Spec -----------------------------------------------------------------
export const ListItemNodeRendererSpec: NodeRendererSpec<ListItemAttributes> = {
  tag: 'li',

  attributes: {/*use the default renderer on all attributes*/},
};

// == Type ========================================================================
// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way since PM does not provide a way to specify the type
//       of the attributes
export type ListItemNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: ListItemAttributes; };
export const isListItemNode = (node: ProseMirrorNode<NotebookSchemaType>): node is ListItemNodeType => node.type.name === NodeName.LIST_ITEM;

// -- JSON Node Type --------------------------------------------------------------
export type ListItemJSONNodeType = JSONNode<ListItemAttributes> & { type: NodeName.LIST_ITEM; };
export const isListItemJSONNode = (node: JSONNode): node is ListItemJSONNodeType => node.type === NodeName.LIST_ITEM;
