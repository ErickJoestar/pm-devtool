import { CommandProps } from '@tiptap/core';

import { createDefaultImageAttributes, ImageAttributes, ImageNodeType, NotebookSchemaType, NodeName } from 'common';

import { replaceAndSelectNode } from '../util/node';

// ********************************************************************************
// == Type ========================================================================
// NOTE: Usage of ambient module to ensure command is TypeScript-registered
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    [NodeName.IMAGE]: {
      /** Add an Image Node. If the attributes are not given, defaults will be used */
      insertImage: (attrs?: ImageAttributes) => ReturnType;
    };
  }
}

// == Implementation ==============================================================
// .. Create ......................................................................
/** Creates an {@link ImageNodeType} from the {@link NotebookSchemaType} */
const createImageNode = (schema: NotebookSchemaType, attributes: ImageAttributes): ImageNodeType =>
  schema.nodes.image.create(attributes) as ImageNodeType/*by definition*/;

/**
 * Creates and selects an Image Node by replacing whatever is at the current
 * selection with the newly created Image Node
 */
 export const insertAndSelectImage = (props: CommandProps, attrs?: ImageAttributes): boolean => {
  const image = createImageNode(props.editor.schema, attrs ? attrs : createDefaultImageAttributes());
  return replaceAndSelectNode(image, props.tr, props.dispatch);
};
