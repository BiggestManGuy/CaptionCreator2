import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

import Grid, { GridItem } from 'components/Grid';
import Button from 'components/Button';

import { makeSelectLayerIDs } from 'containers/CaptionLayers/selectors';
import { openDialog } from 'containers/Dialog/actions';

import {
  EDIT_LAYER_NAME_DIALOG,
  DELETE_LAYER_DIALOG,
} from 'containers/Dialog/constants';

export function LayerActionButtons({
  layerIDs,
  onEditName = () => {},
  onDelete = () => {},
}) {
  return (
    <Grid columns={['auto', 'auto']}>
      <GridItem>
        <Button small icon={faPen} title="Edit Name" onPress={onEditName} />
      </GridItem>
      <GridItem>
        <Button
          small
          danger
          icon={faTrash}
          title="Delete"
          disabled={layerIDs.length === 1}
          onPress={onDelete}
        />
      </GridItem>
    </Grid>
  );
}

LayerActionButtons.propTypes = {
  layerIDs: PropTypes.arrayOf(PropTypes.string),
  onEditName: PropTypes.func,
  onDelete: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  layerIDs: makeSelectLayerIDs(),
});

function mapDispatchToProps(dispatch, { id }) {
  return {
    onEditName: () => dispatch(openDialog(EDIT_LAYER_NAME_DIALOG, { id })),
    onDelete: () => dispatch(openDialog(DELETE_LAYER_DIALOG, { id })),
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
)(LayerActionButtons);
