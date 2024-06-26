/*
 *
 * Dialog reducer
 *
 */
import produce from 'immer';
import { DIALOG_OPEN, DIALOG_CLOSE, DIALOG_SET_LOCK } from './constants';

export const initialState = {
  isOpen: false,
  isLocked: false,
  dialog: null,
};

/* eslint-disable default-case, no-param-reassign */
const dialogReducer = produce((draft, action) => {
  switch (action.type) {
    case DIALOG_OPEN:
      draft.isOpen = true;
      draft.dialog = action.dialog;
      draft.props = action.props;
      draft.isLocked = action.isLocked;
      break;
    case DIALOG_CLOSE:
      draft.isOpen = false;
      break;
    case DIALOG_SET_LOCK:
      draft.isLocked = action.isLocked;
      break;
  }
}, initialState);

export default dialogReducer;
