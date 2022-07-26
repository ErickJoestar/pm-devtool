import { Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';

import { noNodeSpecAttributeDefaultValue, AttributeType, AttributesTypeFromNodeSpecAttributes, TextAlign, VerticalAlign } from '../attribute';
import { NodeRendererSpec } from '../htmlRenderer/type';
import { JSONNode, NodeName } from '../node';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
// ================================================================================
// NOTE: This values must have matching types the ones defined in the Extension.
const ImageAttributeSpec = {
  /** The rendered img tag's src attribute */
  [AttributeType.Src]: noNodeSpecAttributeDefaultValue<string>(),

  /** The rendered img tag's alt attribute */
  [AttributeType.Alt]: noNodeSpecAttributeDefaultValue<string>(),

  /** The rendered img tag's title attribute */
  [AttributeType.Title]: noNodeSpecAttributeDefaultValue<string>(),

  /** The rendered image width */
  [AttributeType.Width]: noNodeSpecAttributeDefaultValue<string>(),

  /** The rendered image height */
  [AttributeType.Height]: noNodeSpecAttributeDefaultValue<string>(),

  /** The rendered image textAlign style attribute */
  [AttributeType.TextAlign]: noNodeSpecAttributeDefaultValue<string>(),

  /** The rendered image alignment with respect to its parent paragraph */
  [AttributeType.VerticalAlign]: noNodeSpecAttributeDefaultValue<string>(),
};
export type ImageAttributes = AttributesTypeFromNodeSpecAttributes<typeof ImageAttributeSpec>;

// == Spec ========================================================================
// -- Node Spec -------------------------------------------------------------------
export const ImageNodeSpec: NodeSpec = {
  name: NodeName.IMAGE,
  inline: true,
  group: 'inline',
  draggable: true,
};

// -- Render Spec -----------------------------------------------------------------
export const ImageNodeRendererSpec: NodeRendererSpec<ImageAttributes> = {
  tag: 'img',
  attributes: {/*TODO: Add attributes*/},
};

// == Type ========================================================================
// -- Node Type -------------------------------------------------------------------
// NOTE: this is the only way since PM does not provide a way to specify the type
//       of the attributes
export type ImageNodeType = ProseMirrorNode<NotebookSchemaType> & { attrs: ImageAttributes; };
export const isImageNode = (node: ProseMirrorNode<NotebookSchemaType>): node is ImageNodeType => node.type.name === NodeName.IMAGE;

// -- JSON Node Type --------------------------------------------------------------
export type ImageJSONNodeType = JSONNode<ImageAttributes> & { type: NodeName.IMAGE; };
export const isImageJSONNode = (node: JSONNode): node is ImageJSONNodeType => node.type === NodeName.IMAGE;

// --------------------------------------------------------------------------------
export const DEFAULT_IMAGE_SRC = 'https://via.placeholder.com/300.png/09f/fff';
export const DEFAULT_IMAGE_ALT = 'image';
export const DEFAULT_IMAGE_TITLE = 'image';
export const DEFAULT_IMAGE_WIDTH = '300px';
export const DEFAULT_IMAGE_HEIGHT = '300px';

export const defaultIMGTag = 'img';
export const defaultParseIMGTag = 'img[src]';
export const base64ParseIMGTag = 'img[src]:not([src^="data:"])';
export const MAX_IMG_WIDTH = 500/*px*/;
export const MAX_IMG_HEIGHT = 500/*px*/;

// == Tool ========================================================================
export const IMAGE_SRC_MODIFIER_TOOL = 'imgSrcModifierTool';
export const IMAGE_ALT_MODIFIER_TOOL = 'imgAltModifierTool';
export const IMAGE_TITLE_MODIFIER_TOOL = 'imgTitleModifierTool';
export const IMAGE_WIDTH_MODIFIER_TOOL = 'imgWidthModifierTool';
export const IMAGE_HEIGHT_MODIFIER_TOOL = 'imgHeightModifierTool';

// == Util ========================================================================
export const createDefaultImageAttributes = (): ImageAttributes =>
  ({
    [AttributeType.Src]: DEFAULT_IMAGE_SRC,
    [AttributeType.Alt]: DEFAULT_IMAGE_ALT,
    [AttributeType.Title]: DEFAULT_IMAGE_TITLE,
    [AttributeType.Width]: DEFAULT_IMAGE_WIDTH,
    [AttributeType.Height]: DEFAULT_IMAGE_HEIGHT,
    [AttributeType.TextAlign]: TextAlign.left,
    [AttributeType.VerticalAlign]: VerticalAlign.bottom,
  });

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
