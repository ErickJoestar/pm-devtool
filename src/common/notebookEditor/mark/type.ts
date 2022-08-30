import { Mark as ProseMirrorMark } from 'prosemirror-model';

import { Attributes } from '../attribute';
import { NotebookSchemaType } from '../schema';

// ********************************************************************************
export type JSONMark<A extends Attributes = {}> = {
  type: MarkName;

  // Attributes are not required in a mark and potentially not be present.
  attrs?: Partial<A>;
};

/** the Range covered by a Mark */
export type MarkRange = {
  mark: ProseMirrorMark;
  from: number;
  to: number;
}

// ================================================================================
export enum MarkName {
  BOLD = 'bold',
  STRIKETHROUGH = 'strikethrough',
  TEXT_STYLE = 'textStyle',
}
export const getMarkName = (mark: ProseMirrorMark) => mark.type.name as MarkName;
export const isMarkName = (name: string) => Object.values(MarkName).includes(name as MarkName/*by definition*/);

// --------------------------------------------------------------------------------
export const markFromJSONMark = (schema: NotebookSchemaType, jsonMark: JSONMark) => ProseMirrorMark.fromJSON(schema, jsonMark);
export const stringifyMarksArray = (marks: ProseMirrorMark[]) => JSON.stringify(marks);
export const parseStringifiedMarksArray = (stringifiedMarks: string) => JSON.parse(stringifiedMarks) as JSONMark[]/*FIXME: handle exceptions!!!*/;
