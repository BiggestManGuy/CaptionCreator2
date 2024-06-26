/**
 *
 * Caption
 * -------
 * Renders an editable HTML representation of the caption.
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import useSelectIntent from 'utils/useSelectIntent';

import CaptionImages from 'containers/CaptionImages';
import CaptionTextEditors from 'containers/CaptionTextEditors';

import { MENU_CONTEXT_CAPTION } from 'containers/ContextMenu/constants';

import { CaptionPersistStorage } from 'containers/CaptionPersistController';
import { useInjectPersistedReducer } from 'utils/injectPersistedReducer';
import { changeContext } from 'containers/ContextMenu/actions';
import {
  makeSelectCaptionWidth,
  makeSelectCaptionHeight,
  makeSelectBackground,
} from './selectors';
import reducer from './reducer';

import CaptionContainer from './CaptionContainer';
import CaptionContent from './CaptionContent';

import { CAPTION_CONTAINER_ID } from './constants';

function Caption({ width, height, background, onCaptionSelect = () => {} }) {
  useInjectPersistedReducer({
    key: 'caption',
    storage: CaptionPersistStorage,
    reducer,
  });

  const registerSelectTarget = useSelectIntent(onCaptionSelect);

  return (
    <CaptionContainer
      ref={registerSelectTarget}
      id={CAPTION_CONTAINER_ID}
      width={width}
      height={height}
      background={background}
    >
      <CaptionContent ref={registerSelectTarget}>
        <CaptionImages />
        <CaptionTextEditors />
      </CaptionContent>
    </CaptionContainer>
  );
}

Caption.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  background: PropTypes.object,
  onCaptionSelect: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  width: makeSelectCaptionWidth(),
  height: makeSelectCaptionHeight(),
  background: makeSelectBackground(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCaptionSelect: () => dispatch(changeContext(MENU_CONTEXT_CAPTION)),
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Caption);
