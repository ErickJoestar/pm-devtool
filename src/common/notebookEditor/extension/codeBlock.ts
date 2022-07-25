import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';

import { noNodeSpecAttributeDefaultValue, AttributeType, AttributesTypeFromNodeSpecAttributes } from '../attribute';
import { RendererState } from '../htmlRenderer/state';
import { createNodeDataTypeAttribute, NodeRendererSpec } from '../htmlRenderer/type';
import { MarkName } from '../mark';
import { JSONNode, NodeIdentifier, NodeName } from '../node';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
// == Attribute ===================================================================
// NOTE: This values must have matching types the ones defined in the Extension.
const CodeBlockAttributesSpec = {
  [AttributeType.Id]: noNodeSpecAttributeDefaultValue<NodeIdentifier>(),

  /** a ContentType-like string that defines what code is in the CodeBlock */
  [AttributeType.Type]: noNodeSpecAttributeDefaultValue<string>(),
  /** does the text wrap within the CodeBlock */
  [AttributeType.Wrap]: noNodeSpecAttributeDefaultValue<boolean>(),
};
export type CodeBlockAttributes = AttributesTypeFromNodeSpecAttributes<typeof CodeBlockAttributesSpec>;

// == Spec ========================================================================
// -- Node Spec -------------------------------------------------------------------
export const CodeBlockNodeSpec: NodeSpec = {
  name: NodeName.CODEBLOCK,

  group: 'block',
  content: `${NodeName.TEXT}*`,
  marks: `${MarkName.BOLD}`,
  defining: true/*important parent node during replace operations, parent of content preserved on replace operations*/,
  code: true/*indicate that the block contains code, which causes some commands (e.g. enter) to behave differently*/,
  allowGapCursor: true,

  attrs: CodeBlockAttributesSpec,
};

// -- Render Spec -----------------------------------------------------------------
const renderCodeBlockNodeView = (attributes: CodeBlockAttributes, content: string, state: RendererState) => {
  const visualId = state[NodeName.CODEBLOCK].visualIds[attributes[AttributeType.Id]];

  // CHECK: is there any reason this can't use JSX to define the structure?
  // NOTE: must not contain white space, else the renderer has issues
  //       (hence it is a single line below)
  // NOTE: createNodeDataTypeAttribute must be used for all nodeRenderSpecs
  //       that define their own renderNodeView
  return `<div ${createNodeDataTypeAttribute(NodeName.CODEBLOCK)} data-visualid="${visualId}" style="${CODEBLOCK_OUTER_CONTAINER_STYLE}"><div style="${CODEBLOCK_INNER_CONTAINER_STYLE}"><p style="${CODEBLOCK_PARAGRAPH_STYLE} ${getWrapStyles(attributes[AttributeType.Wrap])}">${content}</p></div></div>`;
};

export const CodeBlockNodeRendererSpec: NodeRendererSpec<CodeBlockAttributes> = {
  tag: NodeName.CODEBLOCK,

  isNodeViewRenderer: true/*by definition*/,
  renderNodeView: renderCodeBlockNodeView,

  attributes: {/*no need to render attributes*/},
};

// == Type ========================================================================
export enum CodeBlockType { Text = 'Text', Code = 'Code'}
export const isCodeBlockAttributes = (attrs: any): attrs is CodeBlockAttributes => attrs.id !== undefined;

// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way to ensure the right attributes will be available
//       since PM does not provide a way to specify their type
export type CodeBlockNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: CodeBlockAttributes; };
export const isCodeBlockNode = (node: ProseMirrorNode<NotebookSchemaType>): node is CodeBlockNodeType => node.type.name === NodeName.CODEBLOCK;

// -- JSON Node Type --------------------------------------------------------------
export type CodeBlockJSONNodeType = JSONNode<CodeBlockAttributes> & { type: NodeName.CODEBLOCK; };
export const isCodeBlockJSONNode = (node: JSONNode): node is CodeBlockJSONNodeType => node.type === NodeName.CODEBLOCK;

// == CSS =========================================================================
export const CODEBLOCK_OUTER_CONTAINER_STYLE = 'align-items: center;  display: flex; padding: 10px; gap: 10px;';
export const CODEBLOCK_INNER_CONTAINER_STYLE = 'width: 100%; background: #EDF2F7; border: 1px solid; border-color: #CBD5E0; border-radius: 4px; overflow: auto; padding-left: 4px;';
export const CODEBLOCK_PARAGRAPH_STYLE = 'min-height: 1.5em; font-size: 16px; ';
export const CODEBLOCK_VISUAL_ID_STYLE = 'font-size: 14px; font-weight: 600;'/*bold*/;
export const getWrapStyles = (isWrap: boolean) => `white-space: ${isWrap ? 'pre' : 'break-spaces'};`;
