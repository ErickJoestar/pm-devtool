import { useEffect, useMemo, useState } from 'react';

import { getSchema, NotebookSchemaVersion } from 'common';

import { editorExtensions, Editor } from 'notebookEditor/API';

import { EditorContext } from './EditorContext';

// ********************************************************************************
// == Interface ===================================================================
interface Props { children: React.ReactNode; }

// == Component ===================================================================
export const EditorProvider: React.FC<Props> = ({ children }) => {
  const editor = useMemo(() => new Editor(getSchema(NotebookSchemaVersion.V1), editorExtensions), [/*no deps*/]);

  // -- State ---------------------------------------------------------------------
  const [/*state can be accessed through Editor object*/, setViewState] = useState(editor.view.state);

  useEffect(() => {
    editor.setReactUpdateCallback(setViewState);
  }, [editor]);

  // TODO: add back
  // sets the initial Theme when the component mounts
  // useEffect(() => {
  //   setThemeStylesheet()/*sync stylesheet*/;
  // }, [/*only on mount/unmount*/]);

  return <EditorContext.Provider value={{ editor }}>{children}</EditorContext.Provider>;
};
