import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';

import { AttributesTypeFromNodeSpecAttributes, AttributeType, noNodeSpecAttributeDefaultValue } from '../attribute';
import { createNodeDataTypeAttribute, NodeRendererSpec } from '../htmlRenderer/type';
import { JSONNode, NodeName } from '../node';
import { NotebookSchemaType } from '../schema';
import { asyncNodeStatusToColor } from './asyncNode';
import { CodeBlockAsyncNodeAttributeSpec, createDefaultCodeBlockAsyncNodeAttributes, DEFAULT_CODEBLOCKASYNCNODE_STATUS } from './codeBlockAsyncNode';

// ********************************************************************************
// == Attribute ===================================================================
// NOTE: This values must have matching types the ones defined in the Extension
const DemoAsyncNodeAttributeSpec = { ...CodeBlockAsyncNodeAttributeSpec,
  [AttributeType.Delay]: noNodeSpecAttributeDefaultValue<number>(),
};
export type DemoAsyncNodeAttributes = AttributesTypeFromNodeSpecAttributes<typeof DemoAsyncNodeAttributeSpec>;

// == Spec ========================================================================
// -- Node Spec -------------------------------------------------------------------
export const DemoAsyncNodeSpec: NodeSpec = {
  name: NodeName.DEMO_ASYNCNODE,
  group: 'inline',
  atom: true/*node does not have directly editable content*/,
  leaf: true/*node does not have directly editable content*/,
  inline: true,
  selectable: true,
  draggable: false,
  defining: true/*maintain original node during replace operations if possible*/,
};

// -- Render Spec -----------------------------------------------------------------
const renderDemoAsyncNodeView = (attributes: DemoAsyncNodeAttributes) => {
  // CHECK: is there any reason this can't use JSX to define the structure?
  // NOTE: must not contain white space, else the renderer has issues
  //       (hence it is a single line below)
  // NOTE: createNodeDataTypeAttribute must be used for all nodeRenderSpecs
  //       that define their own renderNodeView
  return `<span ${createNodeDataTypeAttribute(NodeName.DEMO_ASYNCNODE)} style="position: relative; display: inline;"><span style="${DEMO_ASYNCNODE_TEXT_STYLE} ${DEMO_ASYNCNODE_STATUS_COLOR}: ${asyncNodeStatusToColor(attributes.status)};" ${DEMO_ASYNCNODE_DATA_STATE}="">${attributes.text}</span></span>`;
};

export const DemoAsyncNodeRendererSpec: NodeRendererSpec<DemoAsyncNodeAttributes> = {
  tag: NodeName.DEMO_ASYNCNODE,

  isNodeViewRenderer: true/*by definition*/,
  renderNodeView: renderDemoAsyncNodeView,

  attributes: {/*no need to render attributes*/},
};

export const DEFAULT_DEMOASYNCNODE_ID = `Default DemoAsyncNode ID`;
export const DEFAULT_DEMOASYNCNODE_STATUS = DEFAULT_CODEBLOCKASYNCNODE_STATUS/*alias*/;
export const DEFAULT_DEMOASYNCNODE_TEXT = 'Not Executed'/*creation default*/;
export const DEFAULT_DEMOASYNCNODE_DELAY = 4000/*ms*/;

// == Type ========================================================================
// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way to ensure the right attributes will be available
//       since PM does not provide a way to specify their type
export type DemoAsyncNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: DemoAsyncNodeAttributes; };
export const isDemoAsyncNode = (node: ProseMirrorNode<NotebookSchemaType>): node is DemoAsyncNodeType => node.type.name === NodeName.DEMO_ASYNCNODE;

// -- JSON Node Type --------------------------------------------------------------
export type DemoAsyncNodeJSONNodeType = JSONNode<DemoAsyncNodeAttributes> & { type: NodeName.DEMO_ASYNCNODE; };
export const isDemoAsyncNodeJSONNode = (node: JSONNode): node is DemoAsyncNodeJSONNodeType => node.type === NodeName.DEMO_ASYNCNODE;

// == Util ========================================================================
export const createDefaultDemoAsyncNodeAttributes = (): DemoAsyncNodeAttributes =>
  ({ ...createDefaultCodeBlockAsyncNodeAttributes(), [AttributeType.Delay]: DEFAULT_DEMOASYNCNODE_DELAY });

// == CSS =========================================================================
export const DEMO_ASYNCNODE_TEXT_STYLE = 'padding: 4px; margin-left: 4px; margin-right: 4px; border: 1px solid; border-color: #CBD5E0; border-radius: 4px; background: #EDF2F7; word-break: break-word;';
export const DEMO_ASYNCNODE_STATUS_COLOR = '--status-color';
export const DEMO_ASYNCNODE_DATA_STATE = 'data-demoasyncnodestate';
export const DEMO_ASYNCNODE_BORDER_COLOR = 'border-color: #CBD5E0;';
