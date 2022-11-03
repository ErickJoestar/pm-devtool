import { Extension } from 'notebookEditor/extension';
import { BasicKeymap } from 'notebookEditor/extension/basicKeymap';
import { Blockquote } from 'notebookEditor/extension/blockquote';
import { Bold } from 'notebookEditor/extension/bold/Bold';
import { Code } from 'notebookEditor/extension/code';
import { DefaultInputRules } from 'notebookEditor/extension/defaultInputRules';
import { Document } from 'notebookEditor/extension/document';
import { EmojiSuggestion } from 'notebookEditor/extension/emojiSuggestion';
import { GapCursor } from 'notebookEditor/extension/gapcursor';
import { Heading } from 'notebookEditor/extension/heading';
import { History } from 'notebookEditor/extension/history';
import { HorizontalRule } from 'notebookEditor/extension/horizontalRule';
import { Image } from 'notebookEditor/extension/image';
import { Italic } from 'notebookEditor/extension/italic';
import { Link } from 'notebookEditor/extension/link';
import { MarkHolder } from 'notebookEditor/extension/markHolder';
import { Paragraph } from 'notebookEditor/extension/paragraph';
import { ReplacedTextMark } from 'notebookEditor/extension/replacedTextMark';
import { SelectionHandling } from 'notebookEditor/extension/selectionHandling';
import { Strikethrough } from 'notebookEditor/extension/strikethrough';
import { SubScript } from 'notebookEditor/extension/subScript';
import { SuperScript } from 'notebookEditor/extension/superScript';
import { Text } from 'notebookEditor/extension/text';
import { TextStyle } from 'notebookEditor/extension/textStyle';
import { Underline } from 'notebookEditor/extension/underline';

// ********************************************************************************
// == Definition ==================================================================
/**
 * the set of extensions that get added to the Editor. Order is arbitrary since
 * the Editor orders them by priority (SEE: Editor.ts)
 */
export const editorDefinition: Extension[] = [
  BasicKeymap,
  Blockquote,
  Bold,
  Code,
  DefaultInputRules,
  Document,
  EmojiSuggestion,
  GapCursor,
  History,
  Heading,
  HorizontalRule,
  Image,
  Italic,
  Link,
  MarkHolder,
  Paragraph,
  ReplacedTextMark,
  SelectionHandling,
  SubScript,
  SuperScript,
  Strikethrough,
  Text,
  TextStyle,
  Underline,
];
