/**
 *
 * Dialog
 *
 */

import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Modal from 'components/Modal';
import DialogNewCaption from 'containers/DialogNewCaption';
import DialogSaveCaption from 'containers/DialogSaveCaption';
import DialogLoadCaption from 'containers/DialogLoadCaption';
import DialogExportCaption from 'containers/DialogExportCaption';
import DialogNewImage from 'containers/DialogNewImage';
import DialogNewTextEditor from 'containers/DialogNewTextEditor';
import DialogEditLayerName from 'containers/DialogEditLayerName';
import DialogDeleteLayer from 'containers/DialogDeleteLayer';

import { useInjectReducer } from 'utils/injectReducer';

import {
  makeSelectDialogIsOpen,
  makeSelectCurrentDialog,
  makeSelectDialogProps,
  makeSelectDialogLocked,
} from './selectors';
import { closeDialog } from './actions';
import reducer from './reducer';

import {
  NEW_CAPTION_DIALOG,
  SAVE_CAPTION_DIALOG,
  LOAD_CAPTION_DIALOG,
  EXPORT_CAPTION_DIALOG,
  NEW_IMAGE_DIALOG,
  NEW_TEXT_EDITOR_DIALOG,
  EDIT_LAYER_NAME_DIALOG,
  DELETE_LAYER_DIALOG,
} from './constants';

const Dialogs = {
  [NEW_CAPTION_DIALOG]: DialogNewCaption,
  [SAVE_CAPTION_DIALOG]: DialogSaveCaption,
  [LOAD_CAPTION_DIALOG]: DialogLoadCaption,
  [EXPORT_CAPTION_DIALOG]: DialogExportCaption,
  [NEW_IMAGE_DIALOG]: DialogNewImage,
  [NEW_TEXT_EDITOR_DIALOG]: DialogNewTextEditor,
  [EDIT_LAYER_NAME_DIALOG]: DialogEditLayerName,
  [DELETE_LAYER_DIALOG]: DialogDeleteLayer,
};

export function Dialog({
  isOpen,
  dialog,
  props = {},
  isLocked = false,
  onCloseDialog = () => {},
}) {
  useInjectReducer({ key: 'dialog', reducer });

  const [title, setTitle] = useState('Dialog');

  const CurrentDialog = Dialogs[dialog];

  if (!CurrentDialog) return null;
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onRequestClose={onCloseDialog}
      shouldCloseOnOverlayClick={!isLocked}
      shouldCloseOnEsc={!isLocked}
    >
      <CurrentDialog {...props} setTitle={setTitle} />
    </Modal>
  );
}

Dialog.propTypes = {
  isOpen: PropTypes.bool,
  dialog: PropTypes.string,
  props: PropTypes.object,
  isLocked: PropTypes.bool,
  onCloseDialog: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  isOpen: makeSelectDialogIsOpen(),
  dialog: makeSelectCurrentDialog(),
  props: makeSelectDialogProps(),
  isLocked: makeSelectDialogLocked(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCloseDialog: () => dispatch(closeDialog()),
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
)(Dialog);
