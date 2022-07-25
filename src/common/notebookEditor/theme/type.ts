import { Attributes, AttributeType } from '../attribute';
import { HeadingLevel } from '../extension/heading';
import { DATA_NODE_TYPE } from '../htmlRenderer/type';
import { MarkName } from '../mark';
import { NodeName } from '../node';

// ********************************************************************************
// == Element =====================================================================
/**
 * Base type for all theme attributes. Each node can implement its own theme type
 * defining the attributes required by the theme.
 */
// NOTE: The value for a given attribute could be any since there are complex
//       Nodes that requires render attributes based on an external value (e.g.
//       Heading level).
export type ThemeElement<ElementAttributes extends Attributes = Attributes> = Partial<Record<keyof ElementAttributes, any>>;
export type NodeThemeElements = Record<NodeName, ThemeElement>;
export type MarkThemeElements = Record<MarkName, ThemeElement>

// -- Custom Selectors ------------------------------------------------------------
// Custom Selectors are used to select a specific node based on more attributes
// than just the node name. This is useful when a node requires a certain style
// based on an attribute.
// NOTE: Using an object instead of a Enum since the values are using template
//       literals and cannot be used as values for the Enum.
export const CustomSelector = {
  HeadingLevelOne: `[${DATA_NODE_TYPE}="${NodeName.HEADING}"][level="${HeadingLevel.One}"]`,
  HeadingLevelTwo: `[${DATA_NODE_TYPE}="${NodeName.HEADING}"][level="${HeadingLevel.Two}"]`,
  HeadingLevelThree: `[${DATA_NODE_TYPE}="${NodeName.HEADING}"][level="${HeadingLevel.Three}"]`,
} as const;
export type CustomThemeElements = Record<typeof CustomSelector[keyof typeof CustomSelector], ThemeElement>;

// == Theme ======================================================================
export enum ThemeName {
  Default = 'Default',
  GoogleDocs = 'Google Docs',
}
export interface Theme {
  /** the name that identifies the theme */
  // NOTE: This name must be unique.
  name: ThemeName;
  /** the name that will be shown to the user */
  displayName: string;

  /** a record of themes defining the attributes for each element */
  nodes: NodeThemeElements;
  marks: MarkThemeElements;

  /**
   * custom selectors that style the Nodes with a complex selected (e.g. Heading
   * levels).
   * SEE: CustomSelector
   */
  customSelectors: CustomThemeElements;
}

// == Themes ======================================================================
export const DefaultTheme: Theme = {
  name: ThemeName.Default/*expected and guaranteed to be unique*/,
  displayName: 'Default',

  nodes:{
    [NodeName.BULLET_LIST]: {/*no defined value*/},
    [NodeName.DOC]: {/*no defined value*/},
    [NodeName.HEADING]: {/*no defined value*/},
    [NodeName.LIST_ITEM]: {/*no defined value*/},
    [NodeName.ORDERED_LIST]: {/*no defined value*/},
    [NodeName.PARAGRAPH]: {
      [AttributeType.TextColor]: '#000',
      [AttributeType.FontSize]: '16px',
    },
    [NodeName.TASK_LIST]: {/*no defined value*/},
    [NodeName.TEXT]:{/*no defined value*/},
  },

  marks: {
    [MarkName.BOLD]:  {/*no defined value*/},
    [MarkName.TEXT_STYLE]:  {/*no defined value*/},
  },

  customSelectors: {
    [CustomSelector.HeadingLevelOne]: {
      [AttributeType.FontSize]: '34px',
      [AttributeType.TextColor]: '#1C5987',
    },
    [CustomSelector.HeadingLevelTwo]: {
      [AttributeType.FontSize]: '25px',
      [AttributeType.TextColor]: '#4E7246',
    },
    [CustomSelector.HeadingLevelThree]: {
      [AttributeType.FontSize]: '20px',
      [AttributeType.TextColor]: '#89B181',
    },
  },
};

export const GoogleDocsTheme: Theme = {
  name: ThemeName.GoogleDocs/*expected and guaranteed to be unique*/,
  displayName: 'Default',

  nodes:{
    [NodeName.BULLET_LIST]: {/*no defined value*/},
    [NodeName.DOC]: {/*no defined value*/},
    [NodeName.HEADING]: {/*no defined value*/},
    [NodeName.LIST_ITEM]: {/*no defined value*/},
    [NodeName.ORDERED_LIST]: {/*no defined value*/},
    [NodeName.PARAGRAPH]: {
      [AttributeType.FontSize]: '11pt',
      [AttributeType.TextColor]: '#353744',
    },
    [NodeName.TASK_LIST]:{/*no defined value*/},
    [NodeName.TEXT]:{/*no defined value*/},
  },

  marks: {
    [MarkName.BOLD]:  {/*no defined value*/},
    [MarkName.TEXT_STYLE]:  {/*no defined value*/},
  },

  customSelectors: {
    [CustomSelector.HeadingLevelOne]: {
      [AttributeType.FontSize]: '14pt',
      [AttributeType.TextColor]: '#00577C',
    },
    [CustomSelector.HeadingLevelTwo]: {
      [AttributeType.FontSize]: '14pt',
      [AttributeType.TextColor]: '#73AB84',
    },
    [CustomSelector.HeadingLevelThree]: {
      [AttributeType.FontSize]: '13pt',
      [AttributeType.TextColor]: '#353744',
    },
  },
};

// --------------------------------------------------------------------------------
export const Themes: Record<ThemeName, Theme> = {
  [ThemeName.Default]: DefaultTheme,
  [ThemeName.GoogleDocs]: GoogleDocsTheme,
};

