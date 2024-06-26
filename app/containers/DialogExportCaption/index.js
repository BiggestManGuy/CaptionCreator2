/**
 *
 * DialogExportCaption
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  faImage,
  faExclamationTriangle,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FileSaver from 'file-saver';

import { closeDialog, setDialogLock } from 'containers/Dialog/actions';
import makeSelectLayers from 'containers/CaptionLayers/selectors';
import {
  makeSelectFormats,
  getFormatBoxBounds,
} from 'containers/CaptionFormats/selectors';
import makeSelectImages from 'containers/CaptionImages/selectors';

import Form from 'components/Form';
import Text from 'components/Modal/ModalText';
import Link from 'components/Link';
import Footer from 'components/Modal/ModalFooter';
import RadioSelect from 'components/RadioSelect';
import Input, { InputAddon, InputLabel } from 'components/Input';
import Grid, { GridItem } from 'components/Grid';
import Button from 'components/Button';

import { CAPTION_CONTAINER_ID } from 'containers/Caption/constants';

import isImageUpscaleSafe from './isImageUpscaleSafe';
import captionToPNG from './captionToPNG';

export function DialogExportCaption({
  layers = [],
  formats = [],
  images = [],
  setTitle,
  onExportingCaption = () => {},
  onExportCaptionSuccess = () => {},
  onExportCaptionFailure = () => {},
  onCancel = () => {},
}) {
  setTitle('Export Caption');

  const [scale, setScale] = useState(2);
  const [filename, setFilename] = useState('untitled_caption');
  const [isExporting, setIsExporting] = useState(false);
  const [exportIsError, setExportIsError] = useState(false);

  const isUpscaleSafe = images.every(image => {
    const imageLayer = layers.find(layer => layer.id === image.id);
    const imageFormat = formats.find(format => format.id === image.id);
    const [top, right, bottom, left] = getFormatBoxBounds(imageFormat);

    return isImageUpscaleSafe(scale, {
      naturalWidth: image.naturalWidth + left + right,
      naturalHeight: image.naturalHeight + top + bottom,
      width: imageLayer.width,
      height: imageLayer.height,
    });
  });

  const exportCaption = async () => {
    onExportingCaption();
    setIsExporting(true);
    setExportIsError(false);

    try {
      const blob = await captionToPNG(CAPTION_CONTAINER_ID, { scale });

      FileSaver.saveAs(blob, `${filename}.png`);
      onExportCaptionSuccess();
    } catch (e) {
      setExportIsError(true);
      onExportCaptionFailure(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Form>
      <Grid columns={['auto', '1fr']}>
        <GridItem row>
          <Text>Save your caption as a PNG image.</Text>
        </GridItem>
        <GridItem>
          <InputLabel>Scale</InputLabel>
          <RadioSelect
            options={[{ label: '1x', value: 1 }, { label: '2x', value: 2 }]}
            selected={scale}
            onSelect={setScale}
          />
        </GridItem>
        <GridItem>
          <Input
            label="Filename"
            value={filename}
            addonRight={<InputAddon>.png</InputAddon>}
            onChange={setFilename}
          />
        </GridItem>
        {!isUpscaleSafe && (
          <GridItem row>
            <Text warning>
              <FontAwesomeIcon icon={faExclamationTriangle} /> Warning
            </Text>
            <Text>
              One or more of your images is too small to be upscaled to {scale}x
              without quality loss. Consider using{' '}
              <Link href="https://waifu2x.booru.pics/" target="_blank">
                waifu2x
              </Link>{' '}
              on your images or choose a lower scale instead.
            </Text>
          </GridItem>
        )}
        {exportIsError && (
          <GridItem row>
            <Text danger>
              <FontAwesomeIcon icon={faExclamationTriangle} /> Error exporting
              caption, please try again.
            </Text>
          </GridItem>
        )}
      </Grid>
      <Footer>
        <Grid columns={['1fr', 'auto']}>
          <GridItem>
            <Button
              primary
              type="submit"
              disabled={isExporting}
              icon={isExporting ? faSpinner : faImage}
              iconProps={{ pulse: isExporting }}
              text="Export As Image"
              onPress={exportCaption}
            />
          </GridItem>
          <GridItem fixed>
            <Button disabled={isExporting} text="Cancel" onPress={onCancel} />
          </GridItem>
        </Grid>
      </Footer>
    </Form>
  );
}

DialogExportCaption.propTypes = {
  layers: PropTypes.arrayOf(PropTypes.object),
  formats: PropTypes.arrayOf(PropTypes.object),
  images: PropTypes.arrayOf(PropTypes.object),
  setTitle: PropTypes.func.isRequired,
  onExportingCaption: PropTypes.func,
  onExportCaptionFailure: PropTypes.func,
  onExportCaptionSuccess: PropTypes.func,
  onCancel: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  layers: makeSelectLayers(),
  formats: makeSelectFormats(),
  images: makeSelectImages(),
});

function mapDispatchToProps(dispatch) {
  return {
    onExportingCaption: () => dispatch(setDialogLock(true)),
    onExportCaptionSuccess: () => dispatch(closeDialog()),
    onExportCaptionFailure: () => dispatch(setDialogLock(false)),
    onCancel: () => dispatch(closeDialog()),
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
)(DialogExportCaption);
