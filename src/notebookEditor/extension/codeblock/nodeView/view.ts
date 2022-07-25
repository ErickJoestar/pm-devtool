import { Editor } from '@tiptap/core';

import { getWrapStyles, AttributeType, CodeBlockNodeType, CODEBLOCK_OUTER_CONTAINER_STYLE, CODEBLOCK_PARAGRAPH_STYLE } from 'common';

import { getPosType } from 'notebookEditor/extension/util/node';
import { AbstractNodeView } from 'notebookEditor/model/AbstractNodeView';

import { createCodeBlock, DATA_VISUAL_ID } from '../ui';
import { CodeBlockModel } from './model';
import { CodeBlockStorage } from './storage';

// ********************************************************************************
export class CodeBlockView extends AbstractNodeView<CodeBlockNodeType, CodeBlockStorage, CodeBlockModel> {
  // The div that holds the paragraph holding the content of the CodeBlockView.
  // This is present since specific styles must be applied to the outer div
  // (this.dom), and the inner div (innerContainer). Its style determines whether
  // or not the text inside the CodeBlock is wrapped. Other NodeViews may specify
  // as much local elements as their view requires them to.
  private innerContainer: HTMLDivElement;

  // The paragraph where the text content of the codeBlock is rendered
  readonly contentDOM: HTMLElement;

  // == Lifecycle =================================================================
  public constructor(model: CodeBlockModel, editor: Editor, node: CodeBlockNodeType, codeBlockStorage: CodeBlockStorage, getPos: getPosType) {
    super(model, editor, node, codeBlockStorage, getPos);

    // .. UI ......................................................................
    // Create DOM elements and append it to the outer container (dom).
    const { innerContainer, paragraph } = createCodeBlock();
    this.innerContainer = innerContainer;
    this.dom.appendChild(this.innerContainer);

    // .. ProseMirror .............................................................
    // Tell PM that the content fo the node must go into the paragraph element,
    // by delegating keeping track of the it to PM (SEE: NodeView#contentDOM)
    this.contentDOM = paragraph;
  }

  /** @see AbstractNodeView#createDomElement() */
  protected createDomElement() {
    const  outerContainer = document.createElement('div');
           outerContainer.setAttribute('style', CODEBLOCK_OUTER_CONTAINER_STYLE);
    return outerContainer;
  }

  // ..............................................................................
  /** @see AbstractNodeView#updateView() */
  public updateView() {
    const visualId = this.storage.getVisualId(this.node.attrs[AttributeType.Id]);
    this.dom.setAttribute(DATA_VISUAL_ID, visualId);
    this.contentDOM.setAttribute('style', `${CODEBLOCK_PARAGRAPH_STYLE} ${getWrapStyles(this.node.attrs[AttributeType.Wrap])}`);
    this.contentDOM.setAttribute('spellcheck', 'false');
  }
}
