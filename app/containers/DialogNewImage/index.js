/**
 *
 * DialogNewImage
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { faImage } from '@fortawesome/free-solid-svg-icons';

import { closeDialog } from 'containers/Dialog/actions';
import { generateImageID, addImage } from 'containers/CaptionImages/actions';
import { changeContext } from 'containers/ContextMenu/actions';

import Form from 'components/Form';
import Footer from 'components/Modal/ModalFooter';
import Grid, { GridItem } from 'components/Grid';
import Input from 'components/Input';
import Button from 'components/Button';

import { MENU_CONTEXT_IMAGE } from 'containers/ContextMenu/constants';

export function DialogNewImage({
  setTitle,
  onNew = () => {},
  onCancel = () => {},
}) {
  setTitle('New Image');

  const [name, setName] = useState('');

  return (
    <Form>
      <Grid>
        <GridItem>
          <Input label="Name" value={name} debounceMS={0} onChange={setName} />
        </GridItem>
      </Grid>
      <Footer>
        <Grid columns={['1fr', 'auto']}>
          <GridItem>
            <Button
              primary
              type="submit"
              disabled={name === ''}
              icon={faImage}
              text="Add Image"
              onPress={() => onNew(name)}
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

DialogNewImage.propTypes = {
  setTitle: PropTypes.func.isRequired,
  onNew: PropTypes.func,
  onCancel: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onNew: name => {
      const id = generateImageID();
      dispatch(addImage({ id, name }));
      dispatch(changeContext(MENU_CONTEXT_IMAGE, { id }));
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

export default compose(withConnect)(DialogNewImage);
