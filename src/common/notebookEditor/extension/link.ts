import { Mark as ProseMirrorMark, MarkSpec } from 'prosemirror-model';

import { MarkRendererSpec } from '../htmlRenderer/type';
import { MarkName } from '../mark';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
// -- Attribute -------------------------------------------------------------------
// REF: https://www.w3schools.com/tags/att_a_target.asp
export enum LinkTargetValue {
  BLANK = '_blank'/*opens in a new tab*/,
  SELF = '_self'/*opens the linked doc in the same frame as it was clicked*/,
  PARENT = '_parent'/*opens the linked doc in the parent frame*/,
  TOP = '_top'/*opens the linked doc in the full body of the window*/
}
export const isLinkTargetValue = (checkedString: string): checkedString is LinkTargetValue => checkedString in LinkTargetValue;
export type LinkAttributes = {
  href: string;
  target: LinkTargetValue;
};

// -- Defaults --------------------------------------------------------------------
// REF: https://pointjupiter.com/what-noopener-noreferrer-nofollow-explained/
export const DEFAULT_LINK_HREF = ''/*default empty*/;
export const DEFAULT_LINK_TARGET = LinkTargetValue.BLANK;
export const DEFAULT_LINK_PROTOCOLS = [/*currently empty*/];
export const DEFAULT_LINK_REL = 'noopener noreferrer nofollow'/*for general link sanity*/;
export const DEFAULT_LINK_CLASS = 'link'/*NOTE: Must match link class in index.css*/;
export const DEFAULT_LINK_VALIDATE = undefined/*currently not excluding/including any domains or tlds*/;

// ................................................................................
export const createDefaultLinkMarkAttributes = (): LinkAttributes =>
  ({
    href: DEFAULT_LINK_HREF,
    target: DEFAULT_LINK_TARGET,
  });

// -- Options ---------------------------------------------------------------------
export type LinkOptions = {
  /** An array of custom protocols to be registered with linkifyjs */
  protocols: Array<string>;

  /** A list of HTML attributes to be rendered */
  HTMLAttributes: Record<string, string>;

  /**
   * A validation function that modifies link verification for the auto linker.
   * @param url - The url to be validated.
   * @returns - True if the url is valid; false otherwise.
   */
  validate?: (url: string) => boolean;
}

// == General =====================================================================
// NOTE: This property has to be taken into account when inserting links.
//       Otherwise, ranges that should not necessarily receive a link might do so.
//       (SEE: Link.ts #commands, linkCreate.ts)
export const PREVENT_LINK_META = 'preventAutoLink';

// ================================================================================
// -- Mark Spec -------------------------------------------------------------------
export const LinkMarkSpec: MarkSpec = {
  name: MarkName.LINK,
  priority: 108,
  keepOnSplit: false,

  // Do not continue typing with link mark after having added one
  // REF: https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive
  inclusive: false,
};

// -- Mark Type -------------------------------------------------------------------
// NOTE: this is the only way since PM does not provide a way to specify the type
//       of the attributes
export type LinkMarkType = ProseMirrorMark<NotebookSchemaType> & { attrs: LinkAttributes; };
export const isLinkMarkAttributes = (attrs: any): attrs is LinkAttributes => 'href' in attrs && 'target' in attrs;
export const isLinkMark = (mark: ProseMirrorMark<NotebookSchemaType>): mark is LinkMarkType => mark.type.name === MarkName.LINK;

// ================================================================================
// -- Render Spec -----------------------------------------------------------------
export const LinkMarkRendererSpec: MarkRendererSpec = {
  tag: 'a',
  render: { style: 'color: #0000EE: text-decoration: underline; cursor: inherit;' },

  attributes: {/*no attributes*/},
};
