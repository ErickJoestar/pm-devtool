import { Node as ProseMirrorNode, Schema } from 'prosemirror-model';

import { Attributes } from './attribute';
import { JSONMark } from './mark';

// ********************************************************************************
export type NodeIdentifier = string/*alias*/;

export type NodeContent = string/*alias*/;
export type NodeTag = string/*alias*/;

// ================================================================================
export type JSONNode<A extends Attributes = {}> = {
  type: NodeName;
  content?: JSONNode[];
  text?: string;

  // Attributes are not required in a node and potentially not be present.
  attrs?: Partial<A>;
  marks?: JSONMark[];
};

// --------------------------------------------------------------------------------
export enum NodeName {
  BULLET_LIST = 'bulletList',
  DOC = 'document',
  HEADING = 'heading',
  LIST_ITEM = 'listItem',
  ORDERED_LIST = 'orderedList',
  PARAGRAPH = 'paragraph',
  TASK_LIST = 'taskList',
  TEXT = 'text',
}
export const getNodeName = (node: ProseMirrorNode) => node.type.name as NodeName;

// --------------------------------------------------------------------------------
export enum NodeType {
  BLOCK = 'block',
  INLINE = 'inline',
  LIST = 'list',
}

// == Utils =======================================================================
export const nodeToJSONNode = (node: ProseMirrorNode) => node.toJSON() as JSONNode;
export const nodeToContent = (node: ProseMirrorNode<Schema>) => JSON.stringify(nodeToJSONNode(node)) as NodeContent;
export const contentToJSONNode = (content: NodeContent) => JSON.parse(content) as JSONNode;
export const contentToNode = (schema: Schema, content?: NodeContent) => content ? ProseMirrorNode.fromJSON(schema, contentToJSONNode(content)) : undefined/*none*/;
