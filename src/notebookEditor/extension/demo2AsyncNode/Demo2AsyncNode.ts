import { Node } from '@tiptap/core';

import { isDemo2AsyncNode, AttributeType, Demo2AsyncNodeSpec, NodeName, SetAttributeType, DEFAULT_DEMO2ASYNCNODE_ID, DEFAULT_DEMO2ASYNCNODE_LASTEXECUTIONHASH, DEFAULT_DEMO2ASYNCNODE_LASTEXECUTIONREPLACEMENT, DEFAULT_DEMO2ASYNCNODE_LASTEXECUTIONTEXT, DEFAULT_DEMO2ASYNCNODE_REPLACETEXT, DEFAULT_DEMO2ASYNCNODE_STATUS } from 'common';

import { getNodeOutputSpec, setAttributeParsingBehavior } from 'notebookEditor/extension/util/attribute';
import { NodeViewStorage } from 'notebookEditor/model/NodeViewStorage';
import { NoOptions } from 'notebookEditor/model/type';

import { handleBlockBackspace, handleBlockArrowUp, handleBlockArrowDown } from '../util/node';
import { toggleDemo2AsyncNodeCommand } from './command';
import { highlightReplacedText } from './highlightReplacedText';
import { Demo2AsyncNodeController, Demo2AsyncNodeStorageType } from './nodeView/controller';
import { highlightDemo2AsyncNodes } from './highlightDemo2AsyncNodes';
import { removeDeletedDemo2AsyncNodeHighlight } from './removeDeletedDemo2AsyncNodeHighlight';

// ********************************************************************************
// == Node ========================================================================
export const Demo2AsyncNode = Node.create<NoOptions, Demo2AsyncNodeStorageType>({
  ...Demo2AsyncNodeSpec,

  // -- Attribute -----------------------------------------------------------------
  addAttributes() {
    return {
      [AttributeType.Id]: setAttributeParsingBehavior(AttributeType.Id, SetAttributeType.STRING, DEFAULT_DEMO2ASYNCNODE_ID),
      [AttributeType.Status]: setAttributeParsingBehavior(AttributeType.Status, SetAttributeType.STRING, DEFAULT_DEMO2ASYNCNODE_STATUS),
      [AttributeType.LastExecutionHash]: setAttributeParsingBehavior(AttributeType.LastExecutionHash, SetAttributeType.STRING, DEFAULT_DEMO2ASYNCNODE_LASTEXECUTIONHASH),
      [AttributeType.LastExecutionReplacement]: setAttributeParsingBehavior(AttributeType.LastExecutionReplacement, SetAttributeType.STRING, DEFAULT_DEMO2ASYNCNODE_LASTEXECUTIONREPLACEMENT),
      [AttributeType.LastExecutionText]: setAttributeParsingBehavior(AttributeType.LastExecutionText, SetAttributeType.STRING, DEFAULT_DEMO2ASYNCNODE_LASTEXECUTIONTEXT),
      [AttributeType.ReplaceText]: setAttributeParsingBehavior(AttributeType.ReplaceText, SetAttributeType.STRING, DEFAULT_DEMO2ASYNCNODE_REPLACETEXT),
    };
  },

  // -- Command -------------------------------------------------------------------
  addCommands() { return { toggleDemo2AsyncNode: toggleDemo2AsyncNodeCommand }; },
  addKeyboardShortcuts() {
    return {
      // toggle a demo2 async node
      'Shift-Alt-Mod-d': () => this.editor.commands.toggleDemo2AsyncNode(),
      'Shift-Alt-Mod-D': () => this.editor.commands.toggleDemo2AsyncNode(),

      // remove code block when at start of document or code block is empty
      'Backspace': ({ editor }) => handleBlockBackspace(editor, NodeName.DEMO2_ASYNCNODE),

      // set gap cursor if necessary
      'ArrowUp': ({ editor }) => handleBlockArrowUp(editor, NodeName.DEMO2_ASYNCNODE),
      'ArrowDown': ({ editor }) => handleBlockArrowDown(editor, NodeName.DEMO2_ASYNCNODE),

      // (SEE: NOTE in Demo2AsyncNodeSpec for code property)
      // exit node on shift enter, inserting a paragraph below
      'Shift-Enter': ({ editor }) => editor.commands.exitCode(),
    };
  },

  // -- Storage -------------------------------------------------------------------
  addStorage() { return new NodeViewStorage<Demo2AsyncNodeController>(); },

  // -- Plugin --------------------------------------------------------------------
  addProseMirrorPlugins() { return [highlightReplacedText()]; },

  // -- Transaction ---------------------------------------------------------------
  onTransaction({ transaction }) {
    if(transaction.doc === transaction.before) return;

    // Highlight the replaced words of demo2AsyncNodes
    highlightDemo2AsyncNodes(this.editor, transaction);

    // Remove decorations of deleted demo2AsyncNodes if they had any
    removeDeletedDemo2AsyncNodeHighlight(this.editor, transaction);
  },

  // -- View ----------------------------------------------------------------------
  addNodeView() {
    return ({ editor, node, getPos }) => {
      if(!isDemo2AsyncNode(node)) throw new Error(`Unexpected node type (${node.type.name}) while adding Demo2AsyncNode NodeView`);
      return new Demo2AsyncNodeController(editor, node, this.storage, getPos);
    };
  },
  parseHTML() { return [{ tag: NodeName.DEMO2_ASYNCNODE, preserveWhitespace: 'full'/*preserve new lines when parsing the content of the demo2AsyncNode*/ }]; },
  renderHTML({ node, HTMLAttributes }) { return getNodeOutputSpec(node, HTMLAttributes, false/*is not a leaf node*/); },
});
