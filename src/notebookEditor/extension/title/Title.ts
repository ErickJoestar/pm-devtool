import { defaultBlockAt, mergeAttributes, Node } from '@tiptap/core';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { Plugin, Selection } from 'prosemirror-state';

import { isStyleAttribute, isTitleNode, snakeCaseToKebabCase, AttributeType, HTMLAttributes, NotebookSchemaType, MarkName, NodeName, SetAttributeType, TitleStorage, TitleNodeSpec } from 'common';
import { setAttributeParsingBehavior } from 'notebookEditor/extension/util/attribute';
import { safeParseTag } from 'notebookEditor/extension/util/parse';

import { generateNodeId, getNodesAffectedByStepMap } from '../util/node';

// ********************************************************************************
// == Node ========================================================================
interface TitleOptions { HTMLAttributes: HTMLAttributes; }
export const Title = Node.create<TitleOptions, TitleStorage>({
  ...TitleNodeSpec,

  // -- Attribute -----------------------------------------------------------------
  addAttributes() {
    return {
      ...this.parent?.(),

      // NOTE: Since the title node remains the same throughout the whole lifecycle
      //       of the document, it receives a random Id as its default, and its not
      //       included in the UniqueNodeId extension's 'includedNodes' set
      id: setAttributeParsingBehavior('id', SetAttributeType.STRING, generateNodeId()),
      initialMarksSet: setAttributeParsingBehavior('initialMarksSet', SetAttributeType.BOOLEAN, false),

      [AttributeType.FontSize]: setAttributeParsingBehavior(AttributeType.FontSize, SetAttributeType.STRING, '45px'),
      [AttributeType.TextColor]: setAttributeParsingBehavior(AttributeType.TextColor, SetAttributeType.STRING, '#05284C'),
      [AttributeType.MarginLeft]: setAttributeParsingBehavior(AttributeType.MarginLeft, SetAttributeType.STRING, '4px'),

      [AttributeType.PaddingTop]: setAttributeParsingBehavior(AttributeType.PaddingTop, SetAttributeType.STRING, '0px'),
      [AttributeType.PaddingBottom]: setAttributeParsingBehavior(AttributeType.PaddingBottom, SetAttributeType.STRING, '0px'),
      [AttributeType.PaddingLeft]: setAttributeParsingBehavior(AttributeType.PaddingLeft, SetAttributeType.STRING, '0px'),
      [AttributeType.PaddingRight]: setAttributeParsingBehavior(AttributeType.PaddingRight, SetAttributeType.STRING, '0px'),

      [AttributeType.MarginTop]: setAttributeParsingBehavior(AttributeType.MarginTop, SetAttributeType.STRING, '0px'),
      [AttributeType.MarginBottom]: setAttributeParsingBehavior(AttributeType.MarginBottom, SetAttributeType.STRING, '0px'),
      [AttributeType.MarginRight]: setAttributeParsingBehavior(AttributeType.MarginRight, SetAttributeType.STRING, '0px'),
    };
  },
  addOptions() { return { HTMLAttributes: {/*currently nothing*/} }; },

  // -- Commands ------------------------------------------------------------------
  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        // Do not allow the title node to be deleted
        // (and hence, the title view to be recreated)
        if(editor.state.selection.$anchor.pos === 1 && editor.state.selection.$head.pos === 1/*at the start of the title by contract, no selection*/)
          return true;
        /* else -- selection not at the start of the title */

        return false;
      },

      // Prevent title from being split on enter by inserting a paragraph below
      // REF: https://github.com/ProseMirror/prosemirror-commands/blob/20fa086dfe21f7ce03e5a05b842cf04e0a91e653/src/commands.ts
      Enter: ({ editor }) => {
        const { dispatch, state } = editor.view,
              { $head } = editor.state.selection;
        if(!dispatch) throw new Error('dispatch undefined when it should not');

        const above = $head.node(-1),
              after = $head.indexAfter(-1),
              type = defaultBlockAt(above.contentMatchAt(after));
        if(!type || !above.canReplaceWith(after, after, type)) return false;

        const filledType = type.createAndFill();
        if(!filledType) throw new Error(`Could not create type: ${type} with filled content`);

        const pos = $head.after(),
            tr = state.tr.replaceWith(pos, pos, filledType);

        tr.setSelection(Selection.near(tr.doc.resolve(pos), 1));
        dispatch(tr.scrollIntoView());
        return true;
      },
    };
  },

  // -- Storage -------------------------------------------------------------------
  addStorage() { return { titleView: document.createElement('div') }; },

  // -- Plugin --------------------------------------------------------------------
  addProseMirrorPlugins() {
    const defaultTitleMarks: MarkName[] = [MarkName.BOLD];

    return [
      new Plugin<NotebookSchemaType>({
        // NOTE: Since the placeholder visual state is meant to represent whether
        //       the title will receive the marks when the user starts typing or
        //       not, the initialMarksSet attribute must be kept in sync as well.
        // NOTE: Since the title node is 'special' (it has a placeholder and there
        //       is only one of it per document), and it also must receive an
        //       initial set of marks -only- the first time the document is
        //       created, and only if the user does not disable the default marks,
        //       a specific plugin (implemented below) is used for it to keep the
        //       placeholder in sync instead of using the setDefaultMarks plugin,
        //       which is meant to be generic and for nodes without placeholders
        // -- Transaction ---------------------------------------------------------
        // NOTE: This only runs on editor creation, right before the initial
        //       title view is rendered. After that, the onTransaction() handler
        //       manages updating the title and its placeholder
        // Ensure the title receives the default marks, but its initialMarks set
        // attribute is kept in sync with the placeholder if it has never been
        // set before
        appendTransaction: (_transactions, oldState, newState) => {
          // NOTE: Proceed with appendTransaction even if docs are the same, since
          //       the placeholder can change without modifying the selection or
          //       applying any steps to the document
          const { tr } = newState;

          const titleNode = newState.doc.child(0/*by contract*/);
          if(!isTitleNode(titleNode)) throw new Error('titleNode is not a Title when it should by contract');
          if(titleNode.attrs.initialMarksSet) return tr/*nothing to do*/;

          const viewElement = document.getElementById(`${NodeName.TITLE}-${titleNode.attrs.id}`);
          if(!viewElement) throw new Error('titleNode viewElement does not exist when it should by contract');

          // Ensure that by default, the title and the placeholder
          // have the default set of marks for the title, adding the marks to
          // stored marks set so that they get carried over by onTransaction
          if(viewElement.classList.length === 0) {
            defaultTitleMarks.forEach(markName => viewElement.classList.add(markName));
            tr.setNodeMarkup(0/*title by contract*/, undefined/*maintain type*/, { initialMarksSet: true })
              .setStoredMarks(defaultTitleMarks.map(markName => newState.schema.marks[markName].create()));
          }

          return tr;
        },
      }),
    ];
  },

  // -- Transaction ---------------------------------------------------------------
  // NOTE: After the initial rendering of the titleView
  //      (SEE: #addProseMirrorPlugins) this transaction handler takes care fully
  //      of maintaining the marks and the placeholder of the title in sync
  onTransaction({ transaction }) {
    // Update placeholder if selection is in title, title is empty
    // and there are stored marks
    const { selection } = transaction;
    if(isTitleNode(selection.$anchor.parent) && !selection.$anchor.parent.textContent.length/*empty title*/) {
      const storedMarks = transaction.storedMarks ? transaction.storedMarks.map(mark => mark.type.name) : [];
      updatePlaceholder(this.storage.titleView, selection.$anchor.parent, storedMarks as MarkName[]/*by definition*/);
      return;
    } /* else -- selection is not at the title itself, check if the transaction modified the content of the title */

    // Update placeholder if the transaction modified the title
    let shouldUpdatePlaceholder = false/*default*/,
        titleNode: ProseMirrorNode<NotebookSchemaType> | undefined = transaction.doc/*default*/;
    transaction.mapping.maps.forEach((stepMap, stepMapIndex) => {
      if(shouldUpdatePlaceholder) return/*already know placeholder must be updated*/;
      stepMap.forEach((unmappedOldStart, unmappedOldEnd) => {
        const { oldNodeObjs, newNodeObjs } = getNodesAffectedByStepMap(transaction, stepMapIndex, unmappedOldStart, unmappedOldEnd, new Set([NodeName.TITLE]));

        if(oldNodeObjs.length || newNodeObjs.length) {
          shouldUpdatePlaceholder = true;
          titleNode = transaction.doc.child(0)/*by contract since there will always be only 1 title*/;
        } /* else -- the transaction did not modify the title, do nothing */
      });
    });
    if(!shouldUpdatePlaceholder) return/*nothing to do*/;
    if(!titleNode || !isTitleNode(titleNode)) throw new Error('Title node does not exist when it should by contract');

    updatePlaceholder(this.storage.titleView, titleNode, [/*remove marks*/]);
  },

  // -- Update --------------------------------------------------------------------
  // Do not allow the document itself to be selected (position 0)
  onSelectionUpdate() {
    const { selection } = this.editor.state;
    if(!(selection.$anchor.pos === 0)) return;
    /* else -- user backspaced paragraph start right below title node */

    this.editor.commands.setTextSelection(1/*inside the title*/);
  },

  // -- View ----------------------------------------------------------------------
  // NOTE: A JS NodeView is being used to maintain easy access to the first created
  //       titleView, which whose reference is in the storage of this extension
  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      this.storage.titleView.setAttribute('id', `${NodeName.TITLE}-${node.attrs.id}`);
      this.storage.titleView.setAttribute('style', getCSSStyleFromAttributes(mergeAttributes(HTMLAttributes)));

      return { dom: this.storage.titleView, contentDOM: this.storage.titleView /*put content inside the div itself */ };
    };
  },
  parseHTML() { return [safeParseTag(NodeName.TITLE)]; },
  renderHTML({ HTMLAttributes }) { return ['p'/*paste as a paragraph whose text content inherits marks instead of as a title node, since there can only be 1 title node*/, mergeAttributes(HTMLAttributes)/*add attrs to pasted html*/, 0]; },
});

// == Util ========================================================================
const updatePlaceholder = (titleView: HTMLDivElement, titleNode: ProseMirrorNode<NotebookSchemaType>, markNames?: MarkName[]) => {
  titleView.setAttribute('data-title', titleNode.textContent.length === 0 ? 'Untitled' : '');
  if(!markNames) return/*nothing to do*/;
  if(markNames.length < 1) {/*no marks to apply next time the user types*/
    titleView.setAttribute('class', '')/*remove all classes*/;
    return/*nothing to do*/;
  }/* else -- add mark name styles to placeholder */

  // NOTE: Classes must match in index.css
  markNames.forEach(markName => titleView.classList.add(markName));
};

// TODO: Use getOutputSpec instead of this
const getCSSStyleFromAttributes = (attributes: Record<string, any>) => {
  // get all "pair:value;" from the specified attributes and merge them in a string
  const properties = Object.keys(attributes).filter(isStyleAttribute);
  const stylesString = properties.reduce((acc, property) => {
    const value = attributes[property];
    if(!value) return acc/*nothing to parse*/;
    const kebabCase = snakeCaseToKebabCase(property);
    const parsed = `${kebabCase}:${value};`;
    return `${acc}${parsed}`;
  }, '');
  return stylesString;
};
