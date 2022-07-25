import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';

import { noNodeSpecAttributeDefaultValue, AttributesTypeFromNodeSpecAttributes, AttributeType } from '../attribute';
import { NodeRendererSpec } from '../htmlRenderer/type';
import { JSONNode, NodeName, NodeType } from '../node';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
// == Attribute ===================================================================
// NOTE: This values must have matching types the ones defined in the Extension.
const BulletListAttributeSpec = {
  // NOTE: This attribute is to ensure the ul gets displayed correctly. It is
  //       not (currently) meant to be editable by the user
  [AttributeType.MarginLeft]: noNodeSpecAttributeDefaultValue<string>(),
};
export type BulletListAttributes = AttributesTypeFromNodeSpecAttributes<typeof BulletListAttributeSpec>

// == Spec ========================================================================
// -- Node Spec -------------------------------------------------------------------
export const BulletListNodeSpec: Readonly<NodeSpec> = {
  name: NodeName.BULLET_LIST/*expected and guaranteed to be unique*/,

  group: `${NodeType.BLOCK} ${NodeType.LIST}`,
  content: `${NodeName.LIST_ITEM}+`,

  attrs: BulletListAttributeSpec,
};

// -- Render Spec -----------------------------------------------------------------
export const BulletListNodeRendererSpec: NodeRendererSpec<BulletListAttributes> = {
  tag: 'ul',

  attributes: {/*use the default renderer on all attributes*/},
};

// == Type ========================================================================
// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way since PM does not provide a way to specify the type
//       of the attributes
export type BulletListNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: BulletListAttributes; };
export const isBulletListNode = (node: ProseMirrorNode<NotebookSchemaType>): node is BulletListNodeType => node.type.name === NodeName.BULLET_LIST;

// -- JSON Node Type --------------------------------------------------------------
export type BulletListJSONNodeType = JSONNode<BulletListAttributes> & { type: NodeName.BULLET_LIST; };
export const isBulletListJSONNode = (node: JSONNode): node is BulletListJSONNodeType => node.type === NodeName.BULLET_LIST;
