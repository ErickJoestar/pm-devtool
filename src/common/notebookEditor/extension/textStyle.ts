import { Mark as ProseMirrorMark, MarkSpec } from 'prosemirror-model';

import { noNodeOrMarkSpecAttributeDefaultValue, AttributeType, AttributesTypeFromNodeSpecAttributes } from '../attribute';
import { getMarkOutputSpec } from '../htmlRenderer/renderer';
import { MarkRendererSpec } from '../htmlRenderer/type';
import { JSONMark, MarkName } from '../mark';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
// == Attribute ===================================================================
// NOTE: must be present on the NodeSpec below
// NOTE: this value must have matching types -- the ones defined in the Extension
const TextStyleAttributesSpec = {
  [AttributeType.FontSize]: noNodeOrMarkSpecAttributeDefaultValue<string>(),
  [AttributeType.TextColor]: noNodeOrMarkSpecAttributeDefaultValue<string>(),
};
export type TextStyleAttributes = AttributesTypeFromNodeSpecAttributes<typeof TextStyleAttributesSpec>;

// == Spec ========================================================================
// -- Mark Spec -------------------------------------------------------------------
export const TextStyleMarkSpec: MarkSpec = {
  name: MarkName.TEXT_STYLE/*expected and guaranteed to be unique*/,

  // NOTE: toDOM must be defined so that the Schema knows how to create it
  //       (SEE: schema.ts)
  toDOM: (mark, inline) => getMarkOutputSpec(mark, mark.attrs ?? {/*empty object if attrs are undefined*/}),

  attrs: TextStyleAttributesSpec,
};

// -- Render Spec -----------------------------------------------------------------
export const TextStyleMarkRendererSpec: MarkRendererSpec<TextStyleAttributes> = {
  // NOTE: the tag is only used for the Editor. The HTML renderer uses the tag of
  //       the TextNode instead
  // SEE: ./renderer.ts
  tag: 'span',
  render: {/*don't render anything by default*/},

  attributes: {/*use the default renderer on all Attributes*/},
};

// == Type ========================================================================
// -- Mark Type -------------------------------------------------------------------
// NOTE: this is the only way since PM does not provide a way to specify the type
//       of the Attributes
export type TextStyleMarkType = ProseMirrorMark<NotebookSchemaType> & { attrs: TextStyleAttributes; };
export const isTextStyleMark = (mark: ProseMirrorMark<NotebookSchemaType>): mark is TextStyleMarkType => mark.type.name === MarkName.TEXT_STYLE;

// -- JSON Mark Type --------------------------------------------------------------
export type TextStyleJSONMarkType = JSONMark<TextStyleAttributes> & { type: MarkName.TEXT_STYLE; };
export const isTextStyleJSONMark = (mark: JSONMark): mark is TextStyleJSONMarkType => mark.type === MarkName.TEXT_STYLE;
