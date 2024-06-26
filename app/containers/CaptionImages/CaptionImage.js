import React, { memo, useRef } from 'react';
import usePrevious from 'react-use/lib/usePrevious';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

import CaptionLayer from 'containers/CaptionLayers';

import { MENU_CONTEXT_IMAGE } from 'containers/ContextMenu/constants';

import { changeContext } from 'containers/ContextMenu/actions';
import {
  updateLayerWidth,
  updateLayerHeight,
} from 'containers/CaptionLayers/actions';
import {
  makeSelectLayerWidth,
  makeSelectLayerHeight,
} from 'containers/CaptionLayers/selectors';
import { makeSelectFormat } from 'containers/CaptionFormats/selectors';
import {
  makeSelectImgFile,
  makeSelectImgNaturalWidth,
  makeSelectImgNaturalHeight,
  makeSelectImgNaturalWidthWithFormat,
  makeSelectImgNaturalHeightWithFormat,
  makeSelectImgRatioLock,
} from './selectors';
import { setImgNaturalWidth, setImgNaturalHeight } from './actions';

import { scaleImgWithFormat, shouldScaleImg } from './scaleImg';

const ImageContainer = styled(CaptionLayer)`
  cursor: pointer;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
`;

const ImagePlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border: 4px dashed rgba(0, 0, 0, 0.6);
  overflow: hidden;
`;

const ImagePlaceholderIcon = styled(FontAwesomeIcon).attrs({
  icon: faImage,
})`
  color: rgba(0, 0, 0, 0.6);
  width: 25% !important;
  height: initial !important;
  max-height: 25%;
`;

export function CaptionImage({
  id,
  file,
  width = 640,
  height = 800,
  naturalWidth,
  naturalHeight,
  naturalWidthWithFormat,
  naturalHeightWithFormat,
  ratioLock = true,
  format,
  onLoad = () => {},
  onLoadError = () => {},
  onImgResize = () => {},
  onImgSelect = () => {},
}) {
  const url = useRef(null);
  const prevFile = usePrevious(file);

  if (file !== prevFile) {
    URL.revokeObjectURL(prevFile);

    if (file instanceof File) {
      url.current = URL.createObjectURL(file);
    } else {
      url.current = null;
    }
  }

  const scaleDimensions = (
    newWidth,
    newHeight,
    newNaturalWidth = naturalWidth,
    newNaturalHeight = naturalHeight,
  ) => {
    if (
      shouldScaleImg({
        ratioLock,
        naturalWidth: newNaturalWidth,
        naturalHeight: newNaturalHeight,
      })
    ) {
      const scaled = scaleImgWithFormat({
        newFormat: format,
        newOuterWidth: newWidth,
        newOuterHeight: newHeight,
        outerWidth: width,
        outerHeight: height,
        naturalWidth: newNaturalWidth,
        naturalHeight: newNaturalHeight,
      });

      onImgResize(scaled.width, scaled.height);
    } else {
      onImgResize(newWidth, newHeight);
    }
  };

  return (
    <ImageContainer
      id={id}
      selectionBoxProps={{
        maxWidth: naturalWidthWithFormat,
        maxHeight: naturalHeightWithFormat,
      }}
      onResize={scaleDimensions}
      onClick={onImgSelect}
    >
      {url.current && (
        <Image
          src={url.current}
          onLoad={evt => {
            const newNaturalWidth = evt.target.naturalWidth;
            const newNaturalHeight = evt.target.naturalHeight;
            const newWidth = Math.min(width, newNaturalWidth);

            scaleDimensions(
              newWidth,
              height,
              newNaturalWidth,
              newNaturalHeight,
            );
            onLoad(newNaturalWidth, newNaturalHeight);
          }}
          onError={onLoadError}
        />
      )}
      {!url.current && (
        <ImagePlaceholder>
          <ImagePlaceholderIcon />
        </ImagePlaceholder>
      )}
    </ImageContainer>
  );
}

CaptionImage.propTypes = {
  id: PropTypes.string.isRequired,
  file: PropTypes.instanceOf(File),
  width: PropTypes.number,
  height: PropTypes.number,
  naturalWidth: PropTypes.number,
  naturalHeight: PropTypes.number,
  naturalWidthWithFormat: PropTypes.number,
  naturalHeightWithFormat: PropTypes.number,
  ratioLock: PropTypes.bool,
  format: PropTypes.object,
  onLoad: PropTypes.func,
  onLoadError: PropTypes.func,
  onImgResize: PropTypes.func,
  onImgSelect: PropTypes.func,
};

const makeMapStateToProps = () => {
  const selectImgFile = makeSelectImgFile();
  const selectImgWidth = makeSelectLayerWidth();
  const selectImgHeight = makeSelectLayerHeight();
  const selectImgNaturalWidth = makeSelectImgNaturalWidth();
  const selectImgNaturalHeight = makeSelectImgNaturalHeight();
  const selectImgNaturalWidthWithFormat = makeSelectImgNaturalWidthWithFormat();
  const selectImgNaturalHeightWithFormat = makeSelectImgNaturalHeightWithFormat();
  const selectRatioLock = makeSelectImgRatioLock();
  const selectFormat = makeSelectFormat();

  return (state, { id }) => ({
    file: selectImgFile(state, { id }),
    width: selectImgWidth(state, { id }),
    height: selectImgHeight(state, { id }),
    naturalWidth: selectImgNaturalWidth(state, { id }),
    naturalHeight: selectImgNaturalHeight(state, { id }),
    naturalWidthWithFormat: selectImgNaturalWidthWithFormat(state, { id }),
    naturalHeightWithFormat: selectImgNaturalHeightWithFormat(state, { id }),
    ratioLock: selectRatioLock(state, { id }),
    format: selectFormat(state, { id }),
  });
};

function mapDispatchToProps(dispatch, { id }) {
  return {
    onLoad: (naturalWidth, naturalHeight) => {
      dispatch(setImgNaturalWidth(id, naturalWidth));
      dispatch(setImgNaturalHeight(id, naturalHeight));
    },
    onLoadError: () => {
      dispatch(setImgNaturalWidth(id, null));
      dispatch(setImgNaturalHeight(id, null));
    },
    onImgSelect: () => dispatch(changeContext(MENU_CONTEXT_IMAGE, { id })),
    onImgResize: (width, height) => {
      dispatch(updateLayerWidth(id, width));
      dispatch(updateLayerHeight(id, height));
    },
    dispatch,
  };
}

const withConnect = connect(
  makeMapStateToProps(),
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(CaptionImage);
