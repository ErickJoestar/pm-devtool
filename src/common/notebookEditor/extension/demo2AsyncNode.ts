import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';

import { AttributesTypeFromNodeSpecAttributes, AttributeType, noNodeSpecAttributeDefaultValue } from '../attribute';
import { createNodeDataTypeAttribute, NodeRendererSpec } from '../htmlRenderer/type';
import { MarkName } from '../mark';
import { JSONNode, NodeName } from '../node';
import { NotebookSchemaType } from '../schema';
import { AsyncNodeAttributeSpec, createDefaultAsyncNodeAttributes, DEFAULT_ASYNCNODE_STATUS } from './asyncNode';

// ********************************************************************************
// == Attribute ===================================================================
// NOTE: This values must have matching types the ones defined in the Extension
const Demo2AsyncNodeAttributeSpec = {
  ...AsyncNodeAttributeSpec,

  /** The hash of the content of the text node, the last time it was executed  */
  [AttributeType.LastExecutionHash]: noNodeSpecAttributeDefaultValue<string>(),

  /** The text that was inserted into the node, replacing the replaceText, on the last execution  */
  [AttributeType.LastExecutionReplacement]: noNodeSpecAttributeDefaultValue<string>(),

  /** The text that was replaced on the last execution of the node  */
  [AttributeType.LastExecutionText]: noNodeSpecAttributeDefaultValue<string>(),

  /** The text that will be looked for in the node's content and be replaced */
  [AttributeType.ReplaceText]: noNodeSpecAttributeDefaultValue<string>(),
};
export type Demo2AsyncNodeAttributes = AttributesTypeFromNodeSpecAttributes<typeof Demo2AsyncNodeAttributeSpec>;

// == Spec ========================================================================
// -- Node Spec -------------------------------------------------------------------
export const Demo2AsyncNodeSpec: NodeSpec = {
  name: NodeName.DEMO2_ASYNCNODE,
  group: 'block',
  content: `${NodeName.TEXT}*`,
  marks: `${MarkName.BOLD}`,
  defining: true/*important parent node during replace operations, parent of content preserved on replace operations*/,
  allowGapCursor: true,

  // NOTE: even though codeBlockAsyncNodes aren't meant to contain 'code',
  //       this property in the spec makes PM handle enters as adding newlines
  //       instead of splitting the node without the need to add a
  //       custom plugin that handles the event or anything similar
  code: true,

  attrs: Demo2AsyncNodeAttributeSpec,
};

// -- Render Spec -----------------------------------------------------------------
const renderDemo2AsyncNodeView = (attributes: Demo2AsyncNodeAttributes, content: string) => {
  // CHECK: is there any reason this can't use JSX to define the structure?
  // NOTE: must not contain white space, else the renderer has issues
  //       (hence it is a single line below)
  // NOTE: createNodeDataTypeAttribute must be used for all nodeRenderSpecs
  //       that define their own renderNodeView
  return `<div ${createNodeDataTypeAttribute(NodeName.DEMO2_ASYNCNODE)}" style="${DEMO2ASYNCNODE_OUTER_CONTAINER_STYLE}"><div style="${computeDemo2AsyncNodeInnerContainerStyle(/*default background*/)}"><p style="${DEMO2ASYNCNODE_PARAGRAPH_STYLE}">${createDemo2AsyncNodeRendererContent(attributes, content)}</p></div></div>`;
};

const createDemo2AsyncNodeRendererContent = (attributes: Demo2AsyncNodeAttributes, content: string) => {
  // NOTE: returned string must not contain white space,
  //       else the renderer has issues (hence it is a single line below)

  const { lastExecutionReplacement } = attributes,
        containsReplacedContent = content.includes(lastExecutionReplacement);
  if(!containsReplacedContent) {
    return `<span>${content}</span>`;
  }/* else -- apply class to replaced content*/

  const indexOfReplacementStart = content.indexOf(lastExecutionReplacement);
  return `<span>${content.slice(0, indexOfReplacementStart)}<span class="${DEMO2ASYNCNODE_REPLACEDTEXT_CLASS}">${content.slice(indexOfReplacementStart, indexOfReplacementStart + lastExecutionReplacement.length)}</span>${content.slice(indexOfReplacementStart + lastExecutionReplacement.length)}</span>`;
};

export const Demo2AsyncNodeRendererSpec: NodeRendererSpec<Demo2AsyncNodeAttributes> = {
  tag: NodeName.DEMO2_ASYNCNODE,

  isNodeViewRenderer: true/*by definition*/,
  renderNodeView: renderDemo2AsyncNodeView,

  attributes: {/*no need to render attributes*/ },
};

export const DEFAULT_DEMO2ASYNCNODE_ID = 'Default Demo2AsyncNode ID';
export const DEFAULT_DEMO2ASYNCNODE_STATUS = DEFAULT_ASYNCNODE_STATUS/*alias*/;
export const DEFAULT_DEMO2ASYNCNODE_LASTEXECUTIONHASH = ''/*empty*/;
export const DEFAULT_DEMO2ASYNCNODE_LASTEXECUTIONREPLACEMENT = ''/*empty*/;
export const DEFAULT_DEMO2ASYNCNODE_LASTEXECUTIONTEXT = ''/*empty*/;
export const DEFAULT_DEMO2ASYNCNODE_REPLACETEXT = ''/*empty*/;

// == Type ========================================================================
// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way to ensure the right attributes will be available
//       since PM does not provide a way to specify their type
export type Demo2AsyncNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: Demo2AsyncNodeAttributes; };
export const isDemo2AsyncNode = (node: ProseMirrorNode<NotebookSchemaType>): node is Demo2AsyncNodeType => node.type.name === NodeName.DEMO2_ASYNCNODE;

// -- JSON Node Type --------------------------------------------------------------
export type Demo2AsyncNodeJSONNodeType = JSONNode<Demo2AsyncNodeAttributes> & { type: NodeName.DEMO2_ASYNCNODE; };
export const isDemo2AsyncNodeJSONNode = (node: JSONNode): node is Demo2AsyncNodeJSONNodeType => node.type === NodeName.DEMO2_ASYNCNODE;

// == Util ========================================================================
export const createDefaultDemo2AsyncNodeAttributes = (): Demo2AsyncNodeAttributes =>
  ({
    ...createDefaultAsyncNodeAttributes(),
    [AttributeType.LastExecutionHash]: DEFAULT_DEMO2ASYNCNODE_LASTEXECUTIONHASH,
    [AttributeType.LastExecutionReplacement]: DEFAULT_DEMO2ASYNCNODE_LASTEXECUTIONREPLACEMENT,
    [AttributeType.LastExecutionText]: DEFAULT_DEMO2ASYNCNODE_LASTEXECUTIONTEXT,
    [AttributeType.ReplaceText]: DEFAULT_DEMO2ASYNCNODE_REPLACETEXT,
  });

// == CSS =========================================================================
export const DEMO2ASYNCNODE_REPLACEDTEXT_CLASS = 'demo2asyncNodeReplacedText'/*NOTE: must match index.css*/;
export const DEMO2ASYNCNODE_OUTER_CONTAINER_STYLE = 'align-items: center;  display: flex; padding: 10px; gap: 10px;';
export const DEMO2ASYNCNODE_PARAGRAPH_STYLE = 'min-height: 1.5em; font-size: 16px; ';

const DEMO2ASYNCNODE_INNER_CONTAINER_STYLE = 'width: 100%; background: #D2F4D3; border: 1px solid; border-color: #CBD5E0; border-radius: 4px; overflow: auto; padding-left: 4px;';
export const computeDemo2AsyncNodeInnerContainerStyle = (background?: string, borderColor?: string) =>
  background && borderColor ? `width: 100%; background: ${background}; border: 1px solid; border-color: ${borderColor}; border-radius: 4px; overflow: auto; padding-left: 4px;`
                            : DEMO2ASYNCNODE_INNER_CONTAINER_STYLE/*default*/;
