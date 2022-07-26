import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';

import { noNodeSpecAttributeDefaultValue, AttributeType, AttributesTypeFromNodeSpecAttributes, TextAlign, VerticalAlign } from '../attribute';
import { NodeRendererSpec } from '../htmlRenderer/type';
import { NodeName } from '../node';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
export const defaultIMGTag = 'img';
export const defaultParseIMGTag = 'img[src]';
export const base64ParseIMGTag = 'img[src]:not([src^="data:"])';
export const MAX_IMG_WIDTH = 500/*px*/;
export const MAX_IMG_HEIGHT = 500/*px*/;

// ================================================================================
// -- Attribute -------------------------------------------------------------------
export const DEFAULT_IMAGE_ID = 'Image ID'/*FIXME: Cannot import DEFAULT_NODE_ID from uniqueNodeId*/;
export const DEFAULT_IMAGE_SRC = 'https://via.placeholder.com/300.png/09f/fff';
export const DEFAULT_IMAGE_ALT = 'image';
export const DEFAULT_IMAGE_TITLE = 'image';
export const DEFAULT_IMAGE_WIDTH = '300px';
export const DEFAULT_IMAGE_HEIGHT = '300px';

// NOTE: This values must have matching types the ones defined in the Extension.
const ImageAttributeSpec = {
  [AttributeType.Src]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.Alt]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.Title]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.Width]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.Height]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.TextAlign]: noNodeSpecAttributeDefaultValue<string>(),
  [AttributeType.VerticalAlign]: noNodeSpecAttributeDefaultValue<string>(),
};
export type ImageAttributes = AttributesTypeFromNodeSpecAttributes<typeof ImageAttributeSpec>;

// ................................................................................
export const createDefaultImageAttributes = (): ImageAttributes =>
  ({
    src: DEFAULT_IMAGE_SRC,
    alt: DEFAULT_IMAGE_ALT,
    title: DEFAULT_IMAGE_TITLE,
    width: DEFAULT_IMAGE_WIDTH,
    height: DEFAULT_IMAGE_HEIGHT,
    textAlign: TextAlign.left,
    verticalAlign: VerticalAlign.bottom,
  });

// .. Resize ......................................................................
/**
 * Checks to see whether the dimensions of an {@link HTMLImageElement} are within
 * the boundaries of what is appropriate to insert into the document, or if the
 * image must be resized while maintaining the ratio
 */
 export const fitImageDimension = (imageNode: HTMLImageElement) => {
  const { src, width, height } = imageNode;

  if(width < MAX_IMG_WIDTH && height < MAX_IMG_HEIGHT) {
    return {
      src,
      fittedWidth: width.toString() + 'px'/*default units*/,
      fittedHeight: height.toString() + 'px'/*default units*/,
    };
  } /* else -- image exceeds limits and must be resized while maintaining ratio */

  const ratio = Math.min(MAX_IMG_WIDTH / width, MAX_IMG_HEIGHT / height),
        newWidth = Math.floor(ratio * width),
        newHeight = Math.floor(ratio * height);

  return {
    src,
    fittedWidth: newWidth.toString() + 'px'/*default units*/,
    fittedHeight: newHeight.toString() + 'px'/*default units*/,
  };
};

// .. Metadata ....................................................................
/**
 * Creates a new {@link HTMLImageElement} and waits for it to load before
 * returning it, so that its naturalWidth and naturalHeight properties can be used
 * to set the right dimension for the {@link ImageNodeType}
 */
export const getImageMeta = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = () => reject();
  });
};

// ================================================================================
// -- Node Spec -------------------------------------------------------------------
export const ImageNodeSpec: NodeSpec = {
  name: NodeName.IMAGE,
  inline: true,
  group: 'inline',
  draggable: true,
};

// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way since PM does not provide a way to specify the type
//       of the attributes
export type ImageNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: ImageAttributes; };
export const isImageNode = (node: ProseMirrorNode<NotebookSchemaType>): node is ImageNodeType => node.type.name === NodeName.IMAGE;

// ================================================================================
// -- Render Spec -----------------------------------------------------------------
export const ImageNodeRendererSpec: NodeRendererSpec<ImageAttributes> = {
  tag: 'img',
  attributes: {/*TODO: Add attributes*/},
};

// == Tool ========================================================================
export const IMAGE_SRC_MODIFIER_TOOL = 'imgSrcModifierTool';
export const IMAGE_ALT_MODIFIER_TOOL = 'imgAltModifierTool';
export const IMAGE_TITLE_MODIFIER_TOOL = 'imgTitleModifierTool';
export const IMAGE_WIDTH_MODIFIER_TOOL = 'imgWidthModifierTool';
export const IMAGE_HEIGHT_MODIFIER_TOOL = 'imgHeightModifierTool';
