import md5 from 'crypto-js/md5';
import hex from 'crypto-js/enc-hex';
import { string } from 'yup';

import { isString } from 'common';

// ********************************************************************************
// == Type ========================================================================
type GetAttrsReturnType = ((p: string | Node) => false | { [key: string]: any; } | null | undefined) | null | undefined;

// == Validation ==================================================================
/**
 * Validates that a string is a valid HTML tag
 *
 * @param tag The string whose HTML-tag-validity will be validated
 * @returns A boolean indicating whether or not the given string is a valid HTML tag
 */
const isValidHTMLTag = (tag: string): boolean => document.createElement(tag).toString() !== '[object HTMLUnknownElement]';

/**
 * Validates that an object is a valid {@link HTMLElement}
 *
 * @param object The object that will be validated
 * @returns A boolean indicating whether or not the given object is a valid {@link HTMLElement}
 */
export const isValidHTMLElement = (object: any): object is HTMLElement => object instanceof HTMLElement;

// == Tag =========================================================================
/**
 * Wrapper around {@link isValidHTMLTag} that throws if {@link isValidHTMLTag}
 * fails or returns an object with the given tagName as its tag key
 *
 * @param tagName The HTML tag name to be passed to {@link isValidHTMLTag}
 * @returns An object with an explicitly defined tag property whose value that
 *          matches the given tagName
 */
export const safeParseTag = (tagName: string) => {
  if(!isValidHTMLTag(tagName)) throw new Error(`Invalid tag name: ${tagName}`);
  return { tag: tagName };
};

/**
 * A wrapper function that allows parseHTML node getAttr calls to safely use node
 * as an HTMLElement
 *
 * @param getAttrsCallback The callback function that will be used as the getAttrs call
 * @returns An instance of {@link GetAttrsReturnType}
 */
export const wrapGetTagAttrs = (getAttrsCallback: (node: HTMLElement) => boolean | { [key: string]: any; } | null | undefined): GetAttrsReturnType => {
  const validatedGetAttrsFunction: GetAttrsReturnType = (node) =>
    !isValidHTMLElement(node)
      ? null
      : getAttrsCallback(node) && null/*required by GetAttrsReturnType*/;

  return validatedGetAttrsFunction;
};

// == String ======================================================================
 // utilities for working with hashed (MD5) values
 export const hashString = (s: string): string => hex.stringify(md5(s));
 export const hashNumber = (n: number): string => hashString(n.toString());

 // -- URL -------------------------------------------------------------------------
// a string()-based URL schema that allows for 'localhost'. Specifically, it only
// adds 'localhost' to the existing Yup regex
// NOTE: the following bug is not fixed: https://github.com/jquense/yup/issues/224
// REF: https://github.com/jquense/yup/blob/master/src/string.js#L9
export const URL_REGEXP = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(localhost|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
export const urlSchema = string()
    .matches(URL_REGEXP,
             { excludeEmptyString: true/*matches .url() behavior*/ });

// == Style =======================================================================
/**
 * A wrapper function that allows parseHTML style getAttr calls to safely use node
 * as an HTMLElement
 *
 * @param getAttrsCallback The callback function that will be used as the getAttrs call
 * @returns An instance of {@link GetAttrsReturnType}
 */
export const wrapGetStyleAttrs = (getAttrsCallback: (value: string) => boolean | { [key: string]: any; } | null | undefined): GetAttrsReturnType => {
  const validatedGetAttrsFunction: GetAttrsReturnType = (value) =>
    !isString(value)
      ? null
      : getAttrsCallback(value) && null/*required by GetAttrsReturnType*/;

  return validatedGetAttrsFunction;
};
