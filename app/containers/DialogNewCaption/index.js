/**
 *
 * DialogNewCaption
 *
 */

import React, { memo, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  faFile,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CaptionPersistContext } from 'containers/CaptionPersistController';
import { changeContext } from 'containers/ContextMenu/actions';
import { closeDialog } from 'containers/Dialog/actions';

import Text from 'components/Modal/ModalText';
import Footer from 'components/Modal/ModalFooter';
import Grid, { GridItem } from 'components/Grid';
import Button from 'components/Button';

import { MENU_CONTEXT_CAPTION } from 'containers/ContextMenu/constants';

export function DialogNewCaption({
  setTitle,
  onNewCaption = () => {},
  onCancel = () => {},
}) {
  setTitle('New Caption');

  const { currentCaption, reset } = useContext(CaptionPersistContext);
  const [showNotSavedWarning, setShowNotSavedWarning] = useState(false);

  // Only determine this when dialog shows, otherwise we get a warning flash
  // when it dismisses.
  useEffect(() => {
    setShowNotSavedWarning(!currentCaption);
  }, []);

  return (
    <>
      {showNotSavedWarning && (
        <>
          <Text warning>
            <FontAwesomeIcon icon={faExclamationTriangle} /> Warning
          </Text>
          <Text>You have not saved your current caption.</Text>
        </>
      )}
      <Footer>
        <Grid columns={['1fr', 'auto']}>
          <GridItem>
            <Button
              primary
              icon={faFile}
              text="New Caption"
              onPress={async () => {
                await reset();
                onNewCaption();
              }}
            />
          </GridItem>
          <GridItem>
            <Button text="Cancel" onPress={onCancel} />
          </GridItem>
        </Grid>
      </Footer>
    </>
  );
}

DialogNewCaption.propTypes = {
  setTitle: PropTypes.func.isRequired,
  onNewCaption: PropTypes.func,
  onCancel: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onNewCaption: () => {
      dispatch(changeContext(MENU_CONTEXT_CAPTION));
      dispatch(closeDialog());
    },
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
)(DialogNewCaption);
