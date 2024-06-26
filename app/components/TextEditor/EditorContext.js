import { omit } from 'lodash';
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const EditorContext = React.createContext({
  editors: {},
  setEditor: () => {},
  removeEditor: () => {},
});

function Provider({ children }) {
  const [editors, setEditors] = useState({});
  const providerValue = useMemo(
    () => ({
      editors,
      setEditor(id, editor) {
        setEditors({ ...editors, [id]: editor });
      },
      removeEditor(id) {
        setEditors(omit(editors, [id]));
      },
    }),
    [editors],
  );
  return (
    <EditorContext.Provider value={providerValue}>
      {children}
    </EditorContext.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
};

export { Provider };
export default EditorContext;
