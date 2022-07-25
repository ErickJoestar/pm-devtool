import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import { NotebookSchemaType, NodeIdentifier, DEMO2ASYNCNODE_REPLACEDTEXT_CLASS } from 'common';

// ********************************************************************************
// This plugin adds decorations for replaced words inside a demo2AsyncNode when
// the hash of their content matches their lastExecutionHash (which, by definition,
// will mean that the replaced word is included in the content at right positions)

// REF: https://discuss.prosemirror.net/t/apply-decorations-directly-through-an-editor-method/2377/3
// Since there is no command to add node decorations and they must be added through
// the decorations plugin prop (SEE: REF above), this is the best possible approach

// == Type ========================================================================
export type HighlightReplacedTextMeta = {
  mapOperation: 'set' | 'delete';
  highlightedNodeId: string;
  from: number;
  to: number;
};

// == Class =======================================================================
class HighlightReplacedText {
  public highlightedDemo2AsyncNodes:  Map<NodeIdentifier, { from: number; to: number; }>;

  constructor() { this.highlightedDemo2AsyncNodes = new Map(); }

  apply(tr: Transaction, thisPluginState: HighlightReplacedText, oldEditorState: EditorState, newEditorState: EditorState) {
    // Produce a new plugin state
    const highlightMeta = getHighlightReplacedTextMeta(tr);
    if(!highlightMeta) {
      return this/*maintain previous state*/;
    }/* else -- update state */

    const { mapOperation, highlightedNodeId, from, to } = highlightMeta;
    mapOperation === 'set'
      ? this.highlightedDemo2AsyncNodes.set(highlightedNodeId, { from, to })
      : this.highlightedDemo2AsyncNodes.delete(highlightedNodeId);

    return this;
  }
}

// == Plugin ======================================================================
export const highlightReplacedTextKey = new PluginKey<HighlightReplacedText, NotebookSchemaType>('highlightReplacedTextKey');
export const highlightReplacedText = () => {
  let plugin = new Plugin<HighlightReplacedText, NotebookSchemaType>({
    // -- Setup -------------------------------------------------------------------
    key: highlightReplacedTextKey,

    // -- State -------------------------------------------------------------------
    state: {
      init(_, state) { return new HighlightReplacedText(); },
      apply(transaction, thisPluginState, oldState, newState) { return thisPluginState.apply(transaction, thisPluginState, oldState, newState); },
    },

    // -- Props -------------------------------------------------------------------
    props: {
      // .. Decoration ............................................................
      decorations(state) {
        const highlightState = getHighlightReplacedTextState(state),
              { highlightedDemo2AsyncNodes } = highlightState;

        const decorationArray: Decoration[] = [];
        highlightedDemo2AsyncNodes.forEach(entry => {
          const decoration = Decoration.inline(entry.from, entry.to, { class: DEMO2ASYNCNODE_REPLACEDTEXT_CLASS, spellcheck: 'false' });
          decorationArray.push(decoration);
        });

        return DecorationSet.create(state.doc, [...decorationArray]);
      },
    },
  });

  return plugin;
};

// == Util ========================================================================
// NOTE: exported function is used by Demo2AsyncNode's onTransaction handler
//       (SEE: Demo2AsyncNode.ts, removeDeletedDemo2AsyncNodeHighlight.ts)
// -- Metadata --------------------------------------------------------------------
export const getHighlightReplacedTextState = (state: EditorState<NotebookSchemaType>) => highlightReplacedTextKey.getState(state) as HighlightReplacedText/*by contract*/;
const getHighlightReplacedTextMeta = (tr: Transaction): HighlightReplacedTextMeta | undefined  => {
  const meta = tr.getMeta(highlightReplacedTextKey);
  if(!isHighlightReplacedTextMeta(meta)) {
    return/*maintain state*/;
  }/* else -- valid metadata */

  return meta;
};

// -- Type Guard ------------------------------------------------------------------
const isHighlightReplacedTextMeta = (object: any): object is HighlightReplacedTextMeta => object && 'highlightedNodeId' in object;
