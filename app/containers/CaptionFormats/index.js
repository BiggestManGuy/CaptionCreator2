/**
 *
 * CaptionFormat
 *
 */

import { isEqual } from 'lodash';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { CaptionPersistStorage } from 'containers/CaptionPersistController';

import { useInjectPersistedReducer } from 'utils/injectPersistedReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectShowRegions, makeSelectFormat } from './selectors';
import reducer from './reducer';
import saga from './saga';
import FormatArea from './FormatArea';

import { S_TOP, S_RIGHT, S_BOTTOM, S_LEFT } from './constants';

export const CaptionFormats = React.forwardRef(
  ({ children, showRegions, formats, ...props }, ref) => {
    useInjectPersistedReducer({
      key: 'captionFormats',
      storage: CaptionPersistStorage,
      reducer,
    });

    useInjectSaga({ key: 'captionFormats', saga });

    return (
      <FormatArea
        ref={ref}
        formats={formats}
        showRegions={showRegions}
        {...props}
      >
        {children}
      </FormatArea>
    );
  },
);

CaptionFormats.propTypes = {
  formatID: PropTypes.string,
  showRegions: PropTypes.bool,
  formats: PropTypes.shape({
    [S_TOP]: PropTypes.object,
    [S_RIGHT]: PropTypes.object,
    [S_BOTTOM]: PropTypes.object,
    [S_LEFT]: PropTypes.object,
  }),
  children: PropTypes.node,
  // dispatch: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const selectShowRegions = makeSelectShowRegions();
  const selectFormat = makeSelectFormat();

  return (state, { formatID: id }) => ({
    showRegions: selectShowRegions(state, { id }),
    formats: selectFormat(state, { id }),
  });
};

const withConnect = connect(
  makeMapStateToProps(),
  null,
  null,
  { forwardRef: true },
);

export default compose(
  withConnect,
  Component => memo(Component, isEqual),
)(CaptionFormats);
