/**
 *
 * DialogDeleteLayer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { makeSelectLayerName } from 'containers/CaptionLayers/selectors';
import { closeDialog } from 'containers/Dialog/actions';
import { deleteLayer } from 'containers/CaptionLayers/actions';

import Text from 'components/Modal/ModalText';
import Footer from 'components/Modal/ModalFooter';
import Grid, { GridItem } from 'components/Grid';
import Button from 'components/Button';

export function DialogDeleteLayer({
  name = 'Layer',
  setTitle,
  onDelete = () => {},
  onCancel = () => {},
}) {
  setTitle(`Delete ${name}`);

  return (
    <>
      <Text>Are you sure? You will not be able to undo this.</Text>
      <Footer>
        <Grid columns={['1fr', 'auto']}>
          <GridItem>
            <Button danger icon={faTrash} text="Delete" onPress={onDelete} />
          </GridItem>
          <GridItem>
            <Button text="Cancel" onPress={onCancel} />
          </GridItem>
        </Grid>
      </Footer>
    </>
  );
}

DialogDeleteLayer.propTypes = {
  name: PropTypes.string,
  setTitle: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

function makeMapStateToProps() {
  const selectLayerName = makeSelectLayerName();

  return (state, { id }) => ({
    name: selectLayerName(state, { id }),
  });
}

function mapDispatchToProps(dispatch, { id }) {
  return {
    onDelete: () => {
      dispatch(deleteLayer(id));
      dispatch(closeDialog());
    },
    onCancel: () => dispatch(closeDialog()),
    dispatch,
  };
}

const withConnect = connect(
  makeMapStateToProps(),
  mapDispatchToProps,
);

export default compose(withConnect)(DialogDeleteLayer);
