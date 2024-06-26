import { indexOf } from 'lodash';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { faBringFront, faSendBack } from 'styles/icons';

import Grid, { GridItem } from 'components/Grid';
import DropdownSelect from 'components/DropdownSelect';
import Button, { ButtonGroup } from 'components/Button';

import { updateLayerOrder } from 'containers/CaptionLayers/actions';
import {
  makeSelectLayerIDs,
  makeSelectLayerNames,
} from 'containers/CaptionLayers/selectors';

const createOrderOption = (index, layerName) => ({
  value: index,
  label: `${index + 1}. ${layerName}`,
});

export function LayerOrder({ id, layerIDs, layerNames, onUpdateOrder }) {
  const thisIndex = indexOf(layerIDs, id);

  return (
    <Grid columns={['1fr', 'auto']}>
      <GridItem>
        <DropdownSelect
          label="Order"
          disabled={layerIDs.length <= 1}
          value={createOrderOption(thisIndex, layerNames[id])}
          options={layerIDs.map((thisID, index) =>
            createOrderOption(index, layerNames[thisID]),
          )}
          onChange={opt => onUpdateOrder(opt.value)}
        />
      </GridItem>
      <GridItem align="end">
        <ButtonGroup>
          <Button
            icon={faBringFront}
            title="Bring Front"
            onPress={() => onUpdateOrder(0)}
          />
          <Button
            icon={faSendBack}
            title="Send Back"
            onPress={() => onUpdateOrder(layerIDs.length)}
          />
        </ButtonGroup>
      </GridItem>
    </Grid>
  );
}

LayerOrder.propTypes = {
  id: PropTypes.string,
  layerIDs: PropTypes.arrayOf(PropTypes.string),
  layerNames: PropTypes.object,
  onUpdateOrder: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  layerIDs: makeSelectLayerIDs(),
  layerNames: makeSelectLayerNames(),
});

function mapDispatchToProps(dispatch, { id }) {
  return {
    onUpdateOrder: order => dispatch(updateLayerOrder(id, order)),
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
)(LayerOrder);
