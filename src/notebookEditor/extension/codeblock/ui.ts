import { CODEBLOCK_INNER_CONTAINER_STYLE, CODEBLOCK_PARAGRAPH_STYLE } from 'common';

// ********************************************************************************
// == Constant ====================================================================
export const DATA_VISUAL_ID = 'data-visualid';

// == Util ========================================================================
export const createCodeBlock = () => {
  const container = document.createElement('div');
        container.setAttribute('style', `${CODEBLOCK_INNER_CONTAINER_STYLE}`);

    const paragraph = document.createElement('p');
          paragraph.setAttribute('style', `${CODEBLOCK_PARAGRAPH_STYLE};`);

  container.appendChild(paragraph);

  return { innerContainer: container, paragraph };
};
