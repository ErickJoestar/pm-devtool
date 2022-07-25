import { Editor } from '@tiptap/core';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { NodeView as ProseMirrorNodeView } from 'prosemirror-view';

import { NotebookSchemaType } from 'common';

import { getPosType, isGetPos } from 'notebookEditor/extension/util/node';

import { NodeViewStorage } from './NodeViewStorage';
import { AbstractNodeView } from './AbstractNodeView';
import { AbstractNodeModel } from './AbstractNodeModel';

// ********************************************************************************
/**
 * Abstract class that holds the common logic for all node controllers.
 * A node controlled is used as a way to hold all the required functionality to
 * implement a {@link ProseMirrorNodeView}, it defines and interacts with the model
 * and the view of the node.
 * @see NodeViewStorage
 * @see AbstractNodeView
 * @see AbstractNodeModel
 */
export abstract class AbstractNodeController<NodeType extends ProseMirrorNode, Storage extends NodeViewStorage<AbstractNodeController<NodeType, any, any, any>> = any, NodeModel extends AbstractNodeModel<NodeType, any> = any, NodeView extends AbstractNodeView<NodeType, Storage, NodeModel> = any>implements ProseMirrorNodeView {
  // == ProseMirror NodeView ======================================================
  /**
   * The outer DOM node that represents the document node.
   * A {@link ProseMirrorNodeView} required property.
   * @see AbstractNodeView
   */
  public readonly dom: HTMLElement;
  /**
   * The DOM node that should hold the node's content. Only meaningful if its node
   * type is not a leaf node type. When this is present, ProseMirror will take
   * care of rendering the node's children into it. When it is not present, the
   * node view itself is responsible for rendering (or deciding not to render) its
   * child nodes.
   * A {@link ProseMirrorNodeView} required property.
   * @see AbstractNodeView
   */
  public contentDOM?: Node | null | undefined;

  // ==============================================================================
  // NOTE: must be initialized by the subclass
  readonly nodeView: NodeView;

  // NOTE: must be initialized by the subclass
  readonly nodeModel: NodeModel;

  public readonly storage: Storage;
  public readonly editor: Editor;
  public node: NodeType;
  public readonly getPos: (() => number);

  // == Life-Cycle ================================================================
  public constructor(nodeModel: NodeModel, nodeView: NodeView, editor: Editor, node: NodeType, storage: Storage, getPos: getPosType) {
    if(!isGetPos(getPos)) throw new Error('getPos is not a function when creating an AbstractNodeController');
    this.editor = editor;
    this.node = node;
    this.getPos = getPos;
    this.storage = storage;
    this.storage.addNodeView(node.attrs.id, this);

    this.nodeModel = nodeModel;
    this.nodeView = nodeView;

    // Hook up the nodeView to this controller
    this.dom = this.nodeView.dom;
    this.contentDOM = this.nodeView.contentDOM;
  }

  // == PM Life-Cycle =============================================================
  /**
   * Updates the DOM node that represents the Node. This method is called by
   * ProseMirror and updates the {@link AbstractNodeView}.
   * A {@link ProseMirrorNodeView} required property.
   */
  public update(node: ProseMirrorNode<NotebookSchemaType>): boolean {
    if(this.node.type.name !== node.type.name) return false/*different node so nothing was updated*/;

    // update both storage and our reference to the Node
    this.storage.addNodeView(this.node.attrs.id, this);
    // Updates node in the model and view
    this.node = node as NodeType/*above check guarantees*/;
    this.nodeModel.node = node as NodeType/*above check guarantees*/;
    this.nodeView.node = node as NodeType/*above check guarantees*/;


    this.nodeView.updateView();
    return true/*as far as this implementation is concerned, an update occurred*/;
  }
}
