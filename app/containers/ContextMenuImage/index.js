/**
 *
 * ContextMenuImage
 *
 */

import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  updateImgFile,
  setImgRatioLock,
} from 'containers/CaptionImages/actions';
import {
  updateLayerWidth,
  updateLayerHeight,
} from 'containers/CaptionLayers/actions';
import { applyFormat } from 'containers/CaptionFormats/actions';
import {
  makeSelectImgFile,
  makeSelectImgRatioLock,
  makeSelectImgNaturalWidth,
  makeSelectImgNaturalHeight,
  makeSelectImgNaturalWidthWithFormat,
  makeSelectImgNaturalHeightWithFormat,
} from 'containers/CaptionImages/selectors';
import { makeSelectFormat } from 'containers/CaptionFormats/selectors';
import {
  makeSelectLayerName,
  makeSelectLayerWidth,
  makeSelectLayerHeight,
} from 'containers/CaptionLayers/selectors';

import { SidebarTitle } from 'components/Sidebar';
import Grid, { GridItem, GridSpacer } from 'components/Grid';
import FileInput from 'components/FileInput';
import Input from 'components/Input';

import {
  LayerActionButtons,
  LayerPosition,
  LayerOrder,
  LayerBackground,
  Formats,
} from 'containers/ContextMenuCommon';
import {
  scaleImgWithFormat,
  shouldScaleImg,
} from 'containers/CaptionImages/scaleImg';

import RatioLock from './RatioLock';

export function ContextMenuImage({
  id,
  name,
  file,
  width,
  height,
  naturalWidth,
  naturalHeight,
  naturalWidthWithFormat,
  naturalHeightWithFormat,
  ratioLock,
  format,
  onFileUpdate = () => {},
  onResize = () => {},
  onRatioLockChange = () => {},
  onApplyFormat = () => {},
}) {
  const scaleDimensions = (newWidth, newHeight, newFormat) => {
    if (shouldScaleImg({ ratioLock, naturalWidth, naturalHeight })) {
      const scaled = scaleImgWithFormat({
        newFormat,
        format,
        newOuterWidth: newWidth,
        newOuterHeight: newHeight,
        outerWidth: width,
        outerHeight: height,
        naturalWidth,
        naturalHeight,
      });

      onResize(scaled.width, scaled.height);
    } else {
      onResize(newWidth, newHeight);
    }
  };

  return (
    <>
      <Grid columns={['1fr', 'auto']}>
        <GridItem>
          <SidebarTitle>{name}</SidebarTitle>
        </GridItem>
        <GridItem>
          <LayerActionButtons id={id} />
        </GridItem>
      </Grid>
      <Grid>
        <GridItem>
          <FileInput
            file={file}
            label="Image File"
            accept="image/*"
            onSelect={onFileUpdate}
          />
        </GridItem>
      </Grid>
      <GridSpacer />
      <Grid columns={['1fr', 'auto', '1fr']}>
        <GridItem>
          <Input
            label={
              naturalWidth ? `Width [ ${naturalWidthWithFormat}px ]` : 'Width'
            }
            value={Math.round(width)}
            type="number"
            align="right"
            min={1}
            max={naturalWidthWithFormat}
            spinnerStep={1}
            spinnerSensitivity={5}
            sanitize={Math.floor}
            addonRight="px"
            onChange={useCallback(
              newWidth => {
                scaleDimensions(newWidth, height, format);
              },
              [height, format],
            )}
          />
        </GridItem>
        <GridItem align="end">
          <RatioLock
            locked={ratioLock}
            onPress={() => onRatioLockChange(!ratioLock)}
          />
        </GridItem>
        <GridItem>
          <Input
            label={
              naturalHeight
                ? `Height [ ${naturalHeightWithFormat}px ]`
                : 'Height'
            }
            value={Math.round(height)}
            type="number"
            align="right"
            min={1}
            max={naturalHeightWithFormat}
            spinnerStep={1}
            spinnerSensitivity={5}
            sanitize={Math.floor}
            addonRight="px"
            onChange={useCallback(
              newHeight => {
                scaleDimensions(width, newHeight, format);
              },
              [width, format],
            )}
          />
        </GridItem>
        <GridItem>
          <LayerPosition id={id} pos="x" />
        </GridItem>
        <GridItem colStart="3">
          <LayerPosition id={id} pos="y" />
        </GridItem>
        <GridItem row>
          <LayerOrder id={id} />
        </GridItem>
      </Grid>
      <GridSpacer />
      <Grid>
        <GridItem>
          <LayerBackground id={id} />
        </GridItem>
      </Grid>
      <GridSpacer />
      <Formats
        id={id}
        onApplyFormat={useCallback(
          newFormat => {
            scaleDimensions(width, height, newFormat);
            onApplyFormat(newFormat);
          },
          [width, height],
        )}
      />
    </>
  );
}

ContextMenuImage.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  file: PropTypes.instanceOf(File),
  width: PropTypes.number,
  height: PropTypes.number,
  naturalWidth: PropTypes.number,
  naturalHeight: PropTypes.number,
  naturalWidthWithFormat: PropTypes.number,
  naturalHeightWithFormat: PropTypes.number,
  ratioLock: PropTypes.bool,
  format: PropTypes.object,
  onFileUpdate: PropTypes.func,
  onResize: PropTypes.func,
  onRatioLockChange: PropTypes.func,
  onApplyFormat: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const selectImgName = makeSelectLayerName();
  const selectImgFile = makeSelectImgFile();
  const selectImgWidth = makeSelectLayerWidth();
  const selectImgHeight = makeSelectLayerHeight();
  const selectImgRatioLock = makeSelectImgRatioLock();
  const selectImgFormat = makeSelectFormat();
  const selectImgNaturalWidth = makeSelectImgNaturalWidth();
  const selectImgNaturalHeight = makeSelectImgNaturalHeight();
  const selectImgNaturalWidthWithFormat = makeSelectImgNaturalWidthWithFormat();
  const selectImgNaturalHeightWithFormat = makeSelectImgNaturalHeightWithFormat();

  return (state, props) => ({
    name: selectImgName(state, props),
    file: selectImgFile(state, props),
    width: selectImgWidth(state, props),
    height: selectImgHeight(state, props),
    naturalWidth: selectImgNaturalWidth(state, props),
    naturalHeight: selectImgNaturalHeight(state, props),
    naturalWidthWithFormat: selectImgNaturalWidthWithFormat(state, props),
    naturalHeightWithFormat: selectImgNaturalHeightWithFormat(state, props),
    ratioLock: selectImgRatioLock(state, props),
    format: selectImgFormat(state, props),
  });
};

function mapDispatchToProps(dispatch, { id }) {
  return {
    onFileUpdate: file => dispatch(updateImgFile(id, file)),
    onResize: (width, height) => {
      dispatch(updateLayerWidth(id, width));
      dispatch(updateLayerHeight(id, height));
    },
    onRatioLockChange: lock => dispatch(setImgRatioLock(id, lock)),
    onApplyFormat: format => dispatch(applyFormat(id, format)),
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
)(ContextMenuImage);
