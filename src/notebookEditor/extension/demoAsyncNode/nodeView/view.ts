import { asyncNodeStatusToColor, AsyncNodeStatus, DemoAsyncNodeType, DEMO_ASYNCNODE_TEXT_STYLE, DEMO_ASYNCNODE_STATUS_COLOR, DEMO_ASYNCNODE_BORDER_COLOR, DEMO_ASYNCNODE_DATA_STATE } from 'common';

import { AbstractCodeBlockAsyncNodeView } from 'notebookEditor/extension/codeBlockAsyncNode/nodeView/view';
import { createTextSpan } from 'notebookEditor/extension/codeBlockAsyncNode/ui';

import { DemoAsyncNodeStorageType } from './controller';
import { DemoAsyncNodeModel } from './model';

// ********************************************************************************
export class DemoAsyncNodeView extends AbstractCodeBlockAsyncNodeView<string, DemoAsyncNodeType, DemoAsyncNodeStorageType, DemoAsyncNodeModel> {
  // -- Creation ------------------------------------------------------------------
  // Creates the DOM element that will be used to display the node's content.
  protected createViewElement(node: DemoAsyncNodeType): HTMLElement {
    return createTextSpan(node);
  }

  // -- Update --------------------------------------------------------------------
  public updateView() {
    const performingAsyncOperation = this.model.getPerformingAsyncOperation();

    // Update styles
    this.content.setAttribute('style', `${DEMO_ASYNCNODE_TEXT_STYLE} ${DEMO_ASYNCNODE_STATUS_COLOR}: ${performingAsyncOperation ? asyncNodeStatusToColor(AsyncNodeStatus.PROCESSING) : asyncNodeStatusToColor(this.node.attrs.status)}; ${DEMO_ASYNCNODE_BORDER_COLOR};`);
    this.content.setAttribute(DEMO_ASYNCNODE_DATA_STATE, ''/*does not need a value*/);

    if(this.content.innerHTML !== this.node.attrs.text) this.content.innerHTML = this.node.attrs.text;
    /* else -- current view matches state */

    // Call super updateView method.
    super.updateView();
  }
}
