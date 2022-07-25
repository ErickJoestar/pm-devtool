import { Editor } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';

import { isImageNode, getImageMeta, fitImageDimension, createDefaultImageAttributes, NotebookSchemaType } from 'common';

import { NoPluginState } from 'notebookEditor/model/type';

// ********************************************************************************
// == Plugin ======================================================================
export const imagePaste = (editor: Editor) => {
  let plugin = new Plugin<NoPluginState, NotebookSchemaType>({
    // -- Props -------------------------------------------------------------------
    props: {
      // Ensures pasted images get pasted with their naturalWidth and naturalHeight
      // properties by default, by returning true from the paste call and inserting
      // the image nodes once the right image has been calculated
      handlePaste(view, event, slice) {/*when this returns true, paste is manually handled*/
        if(slice.size !== 1/*slices can be of size 0*/) return false;

        const pastedNode = slice.content.child(0/*guaranteed to exist by above check*/);
        if(!isImageNode(pastedNode)) return false;
        /* else -- pasting an image */

        const { src } = pastedNode.attrs;
        triggerImageInsertion(editor, src);
        return true/*paste will be manually handled later*/;
      },
    },
  });

  return plugin;
};

/**
 * Computes the right width and height properties of the pasted image and
 * appends the image as a node afterwards
 */
const triggerImageInsertion = async (editor: Editor, imageSrc: string) => {
  const img = await getImageMeta(imageSrc),
        { src, fittedWidth: width, fittedHeight: height } = fitImageDimension(img);

  try {
    editor.chain().focus().insertImage({ ...createDefaultImageAttributes(), src, width, height }).run();
  } catch(error) {/*CHECK: Does this actually ever run?*/
    console.warn(`Error while pasting image: ${error}`);
  }
};
