/**
 *
 * TextEditor
 *
 */

import React, { useEffect, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

import renderBlock from './Blocks';
import renderMark from './Marks';

import EditorContext, { Provider } from './EditorContext';
import Editor from './Editor';
import commands from './commands';
import queries from './queries';

function TextEditor({ id, value, onChange, hideSelection = false, ...props }) {
  const { setEditor, removeEditor } = useContext(EditorContext);

  const setEditorWithId = useCallback(editor => setEditor(id, editor), [id]);

  useEffect(() => () => removeEditor(id), [id]);

  return (
    <Editor
      ref={setEditorWithId}
      value={value}
      onChange={onChange}
      commands={commands}
      queries={queries}
      renderBlock={renderBlock}
      renderMark={renderMark}
      hideSelection={hideSelection}
      {...props}
    />
  );
}

TextEditor.propTypes = {
  id: PropTypes.string,
  value: PropTypes.object.isRequired,
  hideSelection: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export { EditorContext, Provider as EditorContextProvider };
export default TextEditor;
