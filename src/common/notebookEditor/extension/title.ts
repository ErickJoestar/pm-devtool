import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';

import { noNodeSpecAttributeDefaultValue, AttributeType, AttributesTypeFromNodeSpecAttributes } from '../attribute';
import { NodeRendererSpec } from '../htmlRenderer/type';
import { NodeIdentifier, NodeName } from '../node';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
export type TitleStorage = { titleView: HTMLDivElement; }

// ================================================================================
// -- Attribute -------------------------------------------------------------------
export const TITLE_ID = 'Default Title ID'/*FIXME: Cannot import DEFAULT_NODE_ID from uniqueNodeId*/;

// NOTE: This values must have matching types the ones defined in the Extension.
const TitleAttributeSpec = {
  [AttributeType.Id]: noNodeSpecAttributeDefaultValue<NodeIdentifier>(),
  [AttributeType.InitialMarksSet]: noNodeSpecAttributeDefaultValue<boolean>(),

  [AttributeType.FontSize]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.TextColor]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.MarginLeft]: noNodeSpecAttributeDefaultValue<string>(),

  [AttributeType.PaddingTop]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.PaddingBottom]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.PaddingLeft]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.PaddingRight]: noNodeSpecAttributeDefaultValue<string>(),

  [AttributeType.MarginTop]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.MarginBottom]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.MarginRight]: noNodeSpecAttributeDefaultValue<string>(),

};
export type TitleAttributes = AttributesTypeFromNodeSpecAttributes<typeof TitleAttributeSpec>;

// ================================================================================
// -- Node Spec -------------------------------------------------------------------
export const TitleNodeSpec: NodeSpec = {
  name: NodeName.TITLE,
  group: 'block',
  content: `${NodeName.TEXT}*`,
};

// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way since PM does not provide a way to specify the type
//       of the attributes
export type TitleNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: TitleAttributes; };
export const isTitleNode = (node: ProseMirrorNode<NotebookSchemaType>): node is TitleNodeType => node.type.name === NodeName.TITLE;

// ================================================================================
// -- Render Spec -----------------------------------------------------------------
export const TitleNodeRendererSpec: NodeRendererSpec<TitleAttributes> = {
  tag: 'div',
  attributes: {/*TODO: Add attributes*/},
};
