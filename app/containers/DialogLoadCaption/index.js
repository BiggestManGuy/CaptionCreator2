/**
 *
 * DialogLoadCaption
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  faFileDownload,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CaptionPersistContext } from 'containers/CaptionPersistController';
import { closeDialog } from 'containers/Dialog/actions';

import Form from 'components/Form';
import Text from 'components/Modal/ModalText';
import DropdownSelect from 'components/DropdownSelect';
import Grid, { GridItem } from 'components/Grid';
import Button from 'components/Button';
import Footer from 'components/Modal/ModalFooter';

export function DialogLoadCaption({
  setTitle,
  onLoad = () => {},
  onCancel = () => {},
}) {
  setTitle('Load');

  const {
    currentCaption,
    savedCaptions,
    loadCaption,
    deleteCaption,
  } = useContext(CaptionPersistContext);

  const [name, setName] = useState();
  const [isRemoving, setIsRemoving] = useState(false);

  const dropdownOpts = savedCaptions
    .filter(_name => _name !== currentCaption)
    .map(_name => ({ label: _name, value: _name }));

  return (
    <Form>
      <Grid>
        <GridItem>
          <DropdownSelect
            label="Saved Captions"
            options={dropdownOpts}
            value={{ label: name, value: name }}
            isSearchable
            noOptionsMessage={() => 'No Saved Captions'}
            onChange={opt => setName(opt.value)}
          />
        </GridItem>
        {!currentCaption && (
          <GridItem>
            <Text warning>
              <FontAwesomeIcon icon={faExclamationTriangle} /> Warning
            </Text>
            <Text>
              You save not saved your current caption yet. Loading another will
              erase your work.
            </Text>
          </GridItem>
        )}
      </Grid>
      <Footer>
        {(() => {
          if (isRemoving) {
            return (
              <Grid key="delete-confirm" columns={['1fr', 'auto', 'auto']}>
                <GridItem align="center">
                  <Text>
                    <strong>Delete {name}?</strong>
                  </Text>
                </GridItem>
                <GridItem>
                  <Button
                    danger
                    text="Delete"
                    onPress={async () => {
                      await deleteCaption(name);
                      setName(undefined);
                      setIsRemoving(false);
                    }}
                  />
                </GridItem>
                <GridItem>
                  <Button text="Cancel" onPress={() => setIsRemoving(false)} />
                </GridItem>
              </Grid>
            );
          }
          return (
            <Grid columns={['1fr', 'auto', 'auto']}>
              <GridItem>
                <Button
                  danger
                  text="Delete"
                  disabled={!name}
                  onPress={() => setIsRemoving(true)}
                />
              </GridItem>
              <GridItem>
                <Button
                  primary
                  type="submit"
                  icon={faFileDownload}
                  text="Load Caption"
                  disabled={!name}
                  onPress={async () => {
                    await loadCaption(name);
                    onLoad();
                  }}
                />
              </GridItem>
              <GridItem>
                <Button text="Cancel" onPress={onCancel} />
              </GridItem>
            </Grid>
          );
        })()}
      </Footer>
    </Form>
  );
}

DialogLoadCaption.propTypes = {
  setTitle: PropTypes.func.isRequired,
  onLoad: PropTypes.func,
  onCancel: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onLoad: () => dispatch(closeDialog()),
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
)(DialogLoadCaption);
