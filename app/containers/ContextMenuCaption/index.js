/**
 *
 * ContextMenuCaption
 *
 */

import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  faFile,
  faSave,
  faFileUpload,
  faImage,
} from '@fortawesome/free-solid-svg-icons';

import { SidebarTitle } from 'components/Sidebar';
import Grid, { GridItem, GridSpacer } from 'components/Grid';
import Button from 'components/Button';
import Property from 'components/Property';
import BackgroundInput, {
  BG_TYPE_SOLID,
  BG_TYPE_GRADIENT,
} from 'components/BackgroundInput';

import { CaptionPersistContext } from 'containers/CaptionPersistController';
import { openDialog } from 'containers/Dialog/actions';
import { updateBackground } from 'containers/Caption/actions';
import {
  makeSelectCaptionWidth,
  makeSelectCaptionHeight,
  makeSelectBackground,
} from 'containers/Caption/selectors';
import { Formats } from 'containers/ContextMenuCommon';

import {
  NEW_CAPTION_DIALOG,
  SAVE_CAPTION_DIALOG,
  LOAD_CAPTION_DIALOG,
  EXPORT_CAPTION_DIALOG,
} from 'containers/Dialog/constants';

export function ContextMenuCaption({
  width,
  height,
  background,
  onNewCaption = () => {},
  onSaveCaption = () => {},
  onLoadCaption = () => {},
  onExportCaption = () => {},
  onUpdateBackground = () => {},
}) {
  const { currentCaption } = useContext(CaptionPersistContext);

  return (
    <>
      <Grid columns={['1fr', 'auto', 'auto', 'auto', 'auto']}>
        <GridItem>
          <SidebarTitle>{currentCaption || 'Unsaved Caption'}</SidebarTitle>
        </GridItem>
        <GridItem>
          <Button
            small
            icon={faFile}
            title="New Caption"
            onPress={onNewCaption}
          />
        </GridItem>
        <GridItem>
          <Button small icon={faSave} title="Save As" onPress={onSaveCaption} />
        </GridItem>
        <GridItem>
          <Button
            small
            icon={faFileUpload}
            title="Load"
            onPress={onLoadCaption}
          />
        </GridItem>
        <GridItem>
          <Button
            small
            icon={faImage}
            title="Export As Image"
            onPress={onExportCaption}
          />
        </GridItem>
      </Grid>
      <Grid columns={['1fr', '1fr']}>
        <GridItem>
          <Property label="Width">{width} px</Property>
        </GridItem>
        <GridItem>
          <Property label="Height">{height} px</Property>
        </GridItem>
      </Grid>
      <GridSpacer />
      <BackgroundInput
        value={background}
        allowedTypes={[BG_TYPE_SOLID, BG_TYPE_GRADIENT]}
        allowTransparency={false}
        onUpdate={onUpdateBackground}
      />
      <GridSpacer />
      <Formats />
    </>
  );
}

ContextMenuCaption.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  background: PropTypes.object,
  onNewCaption: PropTypes.func,
  onSaveCaption: PropTypes.func,
  onLoadCaption: PropTypes.func,
  onExportCaption: PropTypes.func,
  onUpdateBackground: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  width: makeSelectCaptionWidth(),
  height: makeSelectCaptionHeight(),
  background: makeSelectBackground(),
});

function mapDispatchToProps(dispatch) {
  return {
    onNewCaption: () => dispatch(openDialog(NEW_CAPTION_DIALOG)),
    onSaveCaption: () => dispatch(openDialog(SAVE_CAPTION_DIALOG)),
    onLoadCaption: () => dispatch(openDialog(LOAD_CAPTION_DIALOG)),
    onExportCaption: () => dispatch(openDialog(EXPORT_CAPTION_DIALOG)),
    onUpdateBackground: background => dispatch(updateBackground(background)),
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
)(ContextMenuCaption);
