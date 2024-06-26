/*
 * CaptionCreator
 * --------------
 * Container for the main app (that is, the caption creator).
 */

import React, { useState, useCallback } from 'react';
import useMedia from 'react-use/lib/useMedia';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import breakpoints from 'styles/breakpoints';
import AdjustableView from 'components/AdjustableView';
import { POS_RIGHT, POS_BOTTOM } from 'components/Sidebar/constants';

import Dialog from 'containers/Dialog/Loadable';
import MainMenu from 'containers/MainMenu/Loadable';
import ContextMenu from 'containers/ContextMenu/Loadable';
import Caption from 'containers/Caption/Loadable';
import CaptionPersistController from 'containers/CaptionPersistController';
import { EditorContextProvider } from 'containers/CaptionTextEditors';
import { SelectionBoxPortal } from 'components/SelectionBox';

import { MENU_CONTEXT_CAPTION } from 'containers/ContextMenu/constants';

import { useInjectReducer } from 'utils/injectReducer';
import { changeContext } from 'containers/ContextMenu/actions';
import {
  makeSelectCaptionWidth,
  makeSelectCaptionHeight,
} from 'containers/Caption/selectors';
import { updateCaptionZoom } from './actions';
import { makeSelectCaptionZoom } from './selectors';
import reducer from './reducer';

import Container from './Container';

function CaptionCreator({
  captionZoom,
  captionWidth,
  captionHeight,
  onUpdateCaptionZoom = () => {},
  onChangeContext = () => {},
}) {
  useInjectReducer({ key: 'captionCreator', reducer });

  const isCompact = useMedia(`(max-width: ${breakpoints.compact})`);

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(true);
  const [contextMenuWidth, setContextMenuWidth] = useState(0);
  const [contextMenuHeight, setContextMenuHeight] = useState(0);

  let contextMenuPos;
  let adjustableViewPadding;

  if (isCompact) {
    contextMenuPos = POS_BOTTOM;
    adjustableViewPadding = {
      top: 32,
      right: 0,
      bottom: isContextMenuOpen ? contextMenuHeight : 0,
      left: 0,
    };
  } else {
    contextMenuPos = POS_RIGHT;
    adjustableViewPadding = {
      top: 32,
      right: isContextMenuOpen ? contextMenuWidth : 0,
      bottom: 0,
      left: 0,
    };
  }

  return (
    <CaptionPersistController>
      <EditorContextProvider>
        <Container>
          <Dialog />
          <MainMenu />
          <ContextMenu
            isOpen={isContextMenuOpen}
            position={contextMenuPos}
            onOpen={useCallback(() => {
              setIsContextMenuOpen(true);
            }, [])}
            onClose={useCallback(() => {
              setIsContextMenuOpen(false);
            }, [])}
            onWidthChange={setContextMenuWidth}
            onHeightChange={setContextMenuHeight}
          />
          <AdjustableView
            zoom={captionZoom}
            contentWidth={captionWidth}
            contentHeight={captionHeight}
            extraPanPadding={adjustableViewPadding}
            onZoom={onUpdateCaptionZoom}
            onContainerSelect={useCallback(() => {
              onChangeContext(MENU_CONTEXT_CAPTION);
            }, [])}
          >
            <SelectionBoxPortal />
            <Caption />
          </AdjustableView>
        </Container>
      </EditorContextProvider>
    </CaptionPersistController>
  );
}

CaptionCreator.propTypes = {
  captionZoom: PropTypes.number,
  captionWidth: PropTypes.number.isRequired,
  captionHeight: PropTypes.number.isRequired,
  onUpdateCaptionZoom: PropTypes.func,
  onChangeContext: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  captionZoom: makeSelectCaptionZoom(),
  captionWidth: makeSelectCaptionWidth(),
  captionHeight: makeSelectCaptionHeight(),
});

function mapDispatchToProps(dispatch) {
  return {
    onUpdateCaptionZoom: zoom => dispatch(updateCaptionZoom(zoom)),
    onChangeContext: context => dispatch(changeContext(context)),
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(CaptionCreator);
