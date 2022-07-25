import { Mark as ProseMirrorMark } from 'prosemirror-model';

import { Attributes } from './attribute';

// ********************************************************************************
export type JSONMark<A extends Attributes = {}> = {
  type: MarkName;

  // Attributes are not required in a mark and potentially not be present.
  attrs?: Partial<A>;
};

// ================================================================================
export enum MarkName {
  BOLD = 'bold',
  LINK = 'link',
  TEXT_STYLE = 'textStyle',
}
export const getMarkName = (mark: ProseMirrorMark) => mark.type.name as MarkName;
