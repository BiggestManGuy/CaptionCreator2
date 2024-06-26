/**
 *
 * DialogSaveCaption
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  faSave,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CaptionPersistContext } from 'containers/CaptionPersistController';
import { closeDialog } from 'containers/Dialog/actions';

import Form from 'components/Form';
import Text from 'components/Modal/ModalText';
import Input from 'components/Input';
import Grid, { GridItem } from 'components/Grid';
import Button from 'components/Button';
import Footer from 'components/Modal/ModalFooter';

export function DialogSaveCaption({
  setTitle,
  onSave = () => {},
  onCancel = () => {},
}) {
  setTitle('Save As');

  const { currentCaption, savedCaptions, saveCaption } = useContext(
    CaptionPersistContext,
  );

  const [name, setName] = useState();

  return (
    <Form>
      <Grid>
        <GridItem>
          <Text>
            Your current caption is always saved automatically. Save As allows
            you to load this caption later.
          </Text>
        </GridItem>
        <GridItem>
          <Input label="Name" value={name} debounceMS={0} onChange={setName} />
        </GridItem>
        {currentCaption !== name && savedCaptions.includes(name) && (
          <GridItem>
            <Text warning>
              <FontAwesomeIcon icon={faExclamationTriangle} /> Warning
            </Text>
            <Text>
              You have an existing caption with this name, saving will overwrite
              it.
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
              icon={faSave}
              text="Save Caption"
              disabled={!name}
              onPress={async () => {
                await saveCaption(name);
                onSave();
              }}
            />
          </GridItem>
          <GridItem>
            <Button text="Cancel" onPress={onCancel} />
          </GridItem>
        </Grid>
      </Footer>
    </Form>
  );
}

DialogSaveCaption.propTypes = {
  setTitle: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onSave: () => dispatch(closeDialog()),
    onCancel: () => dispatch(closeDialog()),
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(DialogSaveCaption);
