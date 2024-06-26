/**
 *
 * CaptionTextEditor
 *
 */

import { mapValues } from 'lodash';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Value } from 'slate';

import { EditorContext, EditorContextProvider } from 'components/TextEditor';

import useInjectLayerReducer from 'containers/CaptionLayers/useInjectLayerReducer';
import { CaptionPersistStorage } from 'containers/CaptionPersistController';
import { useInjectPersistedReducer } from 'utils/injectPersistedReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectEditorIDs } from './selectors';
import reducer from './reducer';
import saga from './saga';

import CaptionTextEditor from './CaptionTextEditor';

export function CaptionTextEditors({ editorIDs }) {
  useInjectLayerReducer();

  const isLoaded = useInjectPersistedReducer({
    key: 'captionTextEditors',
    reducer,
    blacklist: ['hideSelection'],
    serialize(state) {
      return {
        ...state,
        editors: mapValues(state.editors, editor => ({
          ...editor,
          editorState: editor.editorState.toJSON(),
        })),
      };
    },
    rehydrate(state) {
      if (state) {
        return {
          ...state,
          editors: mapValues(state.editors, editor => ({
            ...editor,
            editorState: Value.fromJSON(editor.editorState),
          })),
        };
      }
      return state;
    },
    storage: CaptionPersistStorage,
  });

  useInjectSaga({ key: 'captionTextEditors', saga });

  if (isLoaded) {
    return editorIDs.map(id => <CaptionTextEditor id={id} key={id} />);
  }

  return null;
}

CaptionTextEditors.propTypes = {
  editorIDs: PropTypes.arrayOf(PropTypes.string),
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  editorIDs: makeSelectEditorIDs(),
});

const withConnect = connect(mapStateToProps);

export { EditorContext, EditorContextProvider };
export default compose(
  withConnect,
  memo,
)(CaptionTextEditors);
