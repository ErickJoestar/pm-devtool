import { DemoAsyncNodeType } from 'common';

import { nodeToTagID } from 'notebookEditor/extension/util/node';

// ********************************************************************************
// == Common Element ==============================================================
export const createTextSpan = (node: DemoAsyncNodeType) => {
  const textSpan = document.createElement('span');
  textSpan.setAttribute('id', nodeToTagID(node));
  textSpan.innerHTML = node.attrs.text;
  return textSpan;
};
