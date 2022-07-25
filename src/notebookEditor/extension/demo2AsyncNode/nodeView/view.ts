import { Editor } from '@tiptap/core';

import { computeDemo2AsyncNodeInnerContainerStyle, Demo2AsyncNodeType, DEMO2ASYNCNODE_OUTER_CONTAINER_STYLE, DEMO2ASYNCNODE_PARAGRAPH_STYLE } from 'common';

import { AbstractAsyncNodeView } from 'notebookEditor/extension/asyncNode/nodeView/view';
import { getPosType } from 'notebookEditor/extension/util/node';

import { Demo2AsyncNodeStorageType } from './controller';
import { Demo2AsyncNodeModel } from './model';

// ********************************************************************************
export class Demo2AsyncNodeView extends AbstractAsyncNodeView<string, Demo2AsyncNodeType, Demo2AsyncNodeStorageType, Demo2AsyncNodeModel> {
  // The div that holds the paragraph holding the content of the Demo2AsyncNodeView.
  // This is present since specific styles must be applied to the outer div
  // (this.dom), and the inner div (innerContainer). Other NodeViews may specify
  // as much local elements as their view requires them to.
  private innerContainer: HTMLDivElement;

  // The paragraph where the text content of the demo2AsyncNodeView is rendered
  readonly contentDOM: HTMLElement;

  // == Lifecycle =================================================================
  public constructor(model: Demo2AsyncNodeModel, editor: Editor, node: Demo2AsyncNodeType, codeBlockStorage: Demo2AsyncNodeStorageType, getPos: getPosType) {
    super(model, editor, node, codeBlockStorage, getPos);

    // .. UI ......................................................................
    // Create DOM elements and append it to the outer container (dom).
    const innerContainer = document.createElement('div');
          innerContainer.setAttribute('style', computeDemo2AsyncNodeInnerContainerStyle());

    this.innerContainer = innerContainer;
    this.innerContainer.appendChild(this.content);
    this.dom.appendChild(this.innerContainer);

    // .. ProseMirror .............................................................
    // Tell PM that the content fo the node must go into the paragraph element,
    // by delegating keeping track of the it to PM (SEE: NodeView#contentDOM)
    this.contentDOM = this.content/*created by createViewElement call*/;
  }

  // -- Creation ------------------------------------------------------------------
  // creates the DOM element that will be used to contain the node
  protected createDomElement(): HTMLElement {
    const outerContainer = document.createElement('div');
          outerContainer.setAttribute('style', DEMO2ASYNCNODE_OUTER_CONTAINER_STYLE);

    return outerContainer;
  }

  // creates the DOM element that will be used to display the node's content
  protected createViewElement(node: Demo2AsyncNodeType): HTMLElement {
    const paragraph = document.createElement('p');
          paragraph.setAttribute('style', DEMO2ASYNCNODE_PARAGRAPH_STYLE);
          paragraph.setAttribute('spellcheck', 'false');

    return paragraph;
  }

  // -- Update --------------------------------------------------------------------
  public updateView() {
    // check model
    const performingAsyncOperation = this.model.getPerformingAsyncOperation();

    // update styles
    if(performingAsyncOperation && this.innerContainer/*already created*/) {
      this.content.setAttribute('contenteditable', 'false')/*by contract*/;
      this.innerContainer.setAttribute('style', computeDemo2AsyncNodeInnerContainerStyle('#CBD5E0'/*gray background*/, '#CBD5E0'/*gray borderColor*/));
    } else if(this.innerContainer) {
      this.model.getIsDirty()
        ? this.innerContainer.setAttribute('style', computeDemo2AsyncNodeInnerContainerStyle('#D2F4D3'/*default background*/, 'red'/*dirty borderColor*/))
        : this.innerContainer.setAttribute('style', computeDemo2AsyncNodeInnerContainerStyle(/*set default*/));
      this.content.setAttribute('contenteditable', 'true');
    } /* else -- view not created yet, do nothing */

    // call super updateView method.
    super.updateView();
  }
}
