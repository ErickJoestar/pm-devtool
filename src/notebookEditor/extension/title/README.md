# Title

REF: https://discuss.prosemirror.net/t/could-topnode-get-a-nodeview-or-at-least-a-custom-ignoremutation/1632
REF: https://github.com/ProseMirror/prosemirror-view/pull/40

This extension implements a Node that holds the title of the document.

Note that even though one may be tempted to think of this node as the topNode
of the document, PM does not work this way. The document itself is always the
topNode, and it is treated differently than other nodes (e.g. it cannot have a
NodeView, (SEE: the refs above)). Instead of that, the content of the document
node must be modified so that it always includes the title and, afterwards, any
other content (SEE: Document.ts).

Since the title cannot be removed, as it must always be present in the document,
custom backspace behavior is implemented for this node (since, the fact that it
must be present in the document does not mean that the user can't delete it, thus
triggering another titleView creation by PM. The backspace keyboard shortcut
implementation prevents this from happening).

The title node has placeholder functionality that allows it to display text
even when empty (like an HTML input tag). This placeholder inherits the style of
the currently active marks for the paragraph inside the title.

In order to maintain the placeholder style in sync with the marks that are applied
to the title, and have default marks on creation of the document, a JS NodeView is
leveraged, as well as the Title extension storage. A single titleView is used and
maintained throughout the lifecycle of the document. A plugin ensures that the
default set of desired marks is applied on creation and maintained afterwards
through the marks that are carried in the storedMarks Set of the transaction (this
is implemented by an onTransaction implementation).

Since the user cannot 'copy' a title node, the renderHTML behavior of the title is
such that copying the content of the title only copies the text contained within it