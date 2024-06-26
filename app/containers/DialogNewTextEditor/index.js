/**
 *
 * DialogNewTextEditor
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { faText } from 'styles/icons';

import { closeDialog } from 'containers/Dialog/actions';
import {
  generateTextEditorID,
  addEditor,
} from 'containers/CaptionTextEditors/actions';
import { changeContext } from 'containers/ContextMenu/actions';

import Form from 'components/Form';
import Footer from 'components/Modal/ModalFooter';
import Grid, { GridItem } from 'components/Grid';
import Input from 'components/Input';
import Button from 'components/Button';

import { MENU_CONTEXT_TEXT } from 'containers/ContextMenu/constants';

export function DialogNewTextEditor({
  setTitle,
  onNew = () => {},
  onCancel = () => {},
}) {
  setTitle('New Text Region');

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
              icon={faText}
              text="Add Text Region"
              onPress={() => onNew(name)}
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

DialogNewTextEditor.propTypes = {
  setTitle: PropTypes.func.isRequired,
  onNew: PropTypes.func,
  onCancel: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onNew: name => {
      const id = generateTextEditorID();
      dispatch(addEditor({ id, name }));
      dispatch(changeContext(MENU_CONTEXT_TEXT, { id }));
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

export default compose(withConnect)(DialogNewTextEditor);
