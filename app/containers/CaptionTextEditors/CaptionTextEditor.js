/**
 *
 * CaptionTextEditor
 *
 */

import { sum } from 'lodash';
import React, { memo, useCallback } from 'react';
import { useSize } from 'react-use';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Editor from 'components/TextEditor';

import { MENU_CONTEXT_TEXT } from 'containers/ContextMenu/constants';

import CaptionLayer from 'containers/CaptionLayers';

import {
  updateLayerWidth,
  updateLayerHeight,
} from 'containers/CaptionLayers/actions';
import { makeSelectLayerHeight } from 'containers/CaptionLayers/selectors';
import { makeSelectFormatBoxBounds } from 'containers/CaptionFormats/selectors';

import { S_TOP, S_BOTTOM } from 'containers/CaptionFormats/constants';

import { changeContext } from 'containers/ContextMenu/actions';
import {
  makeSelectEditorState,
  makeSelectEditorHeight,
  makeSelectEditorAutoHeight,
  makeSelectEditorSelectionMode,
  makeSelectEditorHideSelection,
} from './selectors';
import {
  updateEditorState,
  updateEditorHeight,
  setAutoHeight,
} from './actions';
import { DEFAULT_EDITOR_ID } from './reducer';

import { SELECTION_MODE_MOVE, SELECTION_MODE_TEXT } from './constants';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const EditorWrapper = styled.div`
  flex: 1;
`;

export function CaptionTextEditor({
  id = DEFAULT_EDITOR_ID,
  height,
  layerHeight,
  editorState,
  autoHeight = true,
  selectionMode = SELECTION_MODE_TEXT,
  hideSelection = false,
  padHeight = 0,
  onEditorStateChange = () => {},
  onEditorSelect = () => {},
  onEditorHeightUpdate = () => {},
  onLayerHeightUpdate = () => {},
  onSetAutoHeight = () => {},
  onEditorResize = () => {},
  ...props
}) {
  const [editor, { height: measuredInnerHeight }] = useSize(() => (
    <EditorWrapper>
      <Editor
        id={id}
        value={editorState}
        hideSelection={hideSelection}
        onChange={onEditorStateChange}
        onFocus={onEditorSelect}
        {...props}
      />
    </EditorWrapper>
  ));

  const newHeight = measuredInnerHeight + padHeight;

  if (newHeight !== Infinity) {
    if (newHeight !== height) {
      onEditorHeightUpdate(newHeight);
    }
    // Auto-height keeps layer height in sync with the editor content.
    // Even if it isn't enabled we still want the layer height to always be
    // greater than or equal.
    if ((autoHeight && newHeight !== layerHeight) || newHeight > layerHeight) {
      onLayerHeightUpdate(newHeight);
    }
  }

  return (
    <CaptionLayer
      id={id}
      selectionBoxProps={{
        minHeight: height,
        allowMove: selectionMode === SELECTION_MODE_MOVE,
      }}
      onResize={useCallback(
        (w, h) => {
          if (autoHeight && h !== layerHeight) onSetAutoHeight(false);
          onEditorResize(w, h);
        },
        [autoHeight, layerHeight],
      )}
      onClick={onEditorSelect}
    >
      <Container>{editor}</Container>
    </CaptionLayer>
  );
}

CaptionTextEditor.propTypes = {
  id: PropTypes.string,
  height: PropTypes.number,
  layerHeight: PropTypes.number,
  editorState: PropTypes.object,
  autoHeight: PropTypes.bool,
  selectionMode: PropTypes.string,
  hideSelection: PropTypes.bool,
  padHeight: PropTypes.number,
  onEditorStateChange: PropTypes.func,
  onEditorSelect: PropTypes.func,
  onEditorHeightUpdate: PropTypes.func,
  onLayerHeightUpdate: PropTypes.func,
  onSetAutoHeight: PropTypes.func,
  onEditorResize: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const selectEditorHeight = makeSelectEditorHeight();
  const selectLayerHeight = makeSelectLayerHeight();
  const selectEditorState = makeSelectEditorState();
  const selectEditorAutoHeight = makeSelectEditorAutoHeight();
  const selectEditorSelectionMode = makeSelectEditorSelectionMode();
  const selectEditorHideSelection = makeSelectEditorHideSelection();
  const selectVerticalBoxBounds = makeSelectFormatBoxBounds([S_TOP, S_BOTTOM]);

  return (state, { id }) => ({
    height: selectEditorHeight(state, { id }),
    layerHeight: selectLayerHeight(state, { id }),
    editorState: selectEditorState(state, { id }),
    autoHeight: selectEditorAutoHeight(state, { id }),
    selectionMode: selectEditorSelectionMode(state, { id }),
    hideSelection: selectEditorHideSelection(state, { id }),
    padHeight: sum(selectVerticalBoxBounds(state, { id })),
  });
};

function mapDispatchToProps(dispatch, { id }) {
  return {
    onEditorStateChange: ({ value }) => dispatch(updateEditorState(id, value)),
    onEditorSelect: () => dispatch(changeContext(MENU_CONTEXT_TEXT, { id })),
    onEditorHeightUpdate: height => dispatch(updateEditorHeight(id, height)),
    onLayerHeightUpdate: height => dispatch(updateLayerHeight(id, height)),
    onSetAutoHeight: autoHeight => dispatch(setAutoHeight(id, autoHeight)),
    onEditorResize: (width, height) => {
      dispatch(updateLayerWidth(id, width));
      dispatch(updateLayerHeight(id, height));
    },
  };
}

const withConnect = connect(
  makeMapStateToProps(),
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CaptionTextEditor);
