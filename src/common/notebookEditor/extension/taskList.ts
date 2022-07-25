import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';

import { noNodeSpecAttributeDefaultValue, AttributesTypeFromNodeSpecAttributes, AttributeType } from '../attribute';
import { NodeRendererSpec } from '../htmlRenderer/type';
import { JSONNode, NodeName, NodeType } from '../node';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
// == Attribute ===================================================================
// NOTE: This values must have matching types the ones defined in the Extension.
const TaskListAttributeSpec = {
  // NOTE: This attribute is to ensure the ul gets displayed correctly. It is
  //       not (currently) meant to be editable by the user
  [AttributeType.MarginLeft]: noNodeSpecAttributeDefaultValue<string>(),
};
export type TaskListAttributes = AttributesTypeFromNodeSpecAttributes<typeof TaskListAttributeSpec>

// == Spec ========================================================================
// -- Node Spec -------------------------------------------------------------------
export const TaskListNodeSpec: Readonly<NodeSpec> = {
  name: NodeName.TASK_LIST/*expected and guaranteed to be unique*/,

  group: `${NodeType.BLOCK} ${NodeType.LIST}`,
  content: `${NodeName.LIST_ITEM}+`,

  attrs: TaskListAttributeSpec,
};

// -- Render Spec -----------------------------------------------------------------
export const TaskListNodeRendererSpec: NodeRendererSpec<TaskListAttributes> = {
  tag: 'ul',

  attributes: {/*use the default renderer on all attributes*/},
  render: {
    'data-type': NodeName.TASK_LIST,
  },
};

// == Type ========================================================================
// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way since PM does not provide a way to specify the type
//       of the attributes
export type TaskListNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: TaskListAttributes; };
export const isTaskListNode = (node: ProseMirrorNode<NotebookSchemaType>): node is TaskListNodeType => node.type.name === NodeName.TASK_LIST;

// -- JSON Node Type --------------------------------------------------------------
export type TaskListJSONNodeType = JSONNode<TaskListAttributes> & { type: NodeName.TASK_LIST; };
export const isTaskListJSONNode = (node: JSONNode): node is TaskListJSONNodeType => node.type === NodeName.TASK_LIST;
