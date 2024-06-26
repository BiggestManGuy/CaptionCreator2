/**
 *
 * DialogEditLayerName
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { closeDialog } from 'containers/Dialog/actions';
import { updateLayerName } from 'containers/CaptionLayers/actions';
import { makeSelectLayerName } from 'containers/CaptionLayers/selectors';

import Form from 'components/Form';
import Footer from 'components/Modal/ModalFooter';
import Grid, { GridItem } from 'components/Grid';
import Input from 'components/Input';
import Button from 'components/Button';

export function DialogEditLayerName({
  setTitle,
  name,
  onUpdateName = () => {},
  onCancel = () => {},
}) {
  setTitle('Edit Name');

  const [updatedName, setName] = useState(name);

  return (
    <Form>
      <Grid>
        <GridItem>
          <Input
            label="Name"
            value={updatedName}
            debounceMS={0}
            onChange={setName}
          />
        </GridItem>
      </Grid>
      <Footer>
        <Grid columns={['1fr', 'auto']}>
          <GridItem>
            <Button
              primary
              type="submit"
              disabled={updatedName === ''}
              text="Update Name"
              onPress={() => onUpdateName(updatedName)}
            />
          </GridItem>
          <GridItem fixed>
            <Button text="Cancel" onPress={onCancel} />
          </GridItem>
        </Grid>
      </Footer>
    </Form>
  );
}

DialogEditLayerName.propTypes = {
  setTitle: PropTypes.func.isRequired,
  name: PropTypes.string,
  onUpdateName: PropTypes.func,
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
    onUpdateName: name => {
      dispatch(updateLayerName(id, name));
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

export default compose(withConnect)(DialogEditLayerName);
