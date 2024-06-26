/*
 *
 * ContextMenu reducer
 *
 */
import produce from 'immer';
import {
  MENU_CONTEXT_CAPTION,
  CHANGE_CONTEXT,
  RESET_CONTEXT,
} from './constants';

export const initialState = {
  context: MENU_CONTEXT_CAPTION,
};

/* eslint-disable default-case, no-param-reassign, consistent-return */
const contextMenuReducer = produce((draft, action) => {
  switch (action.type) {
    case CHANGE_CONTEXT:
      draft.context = action.context;
      draft.data = action.data;
      break;
    case RESET_CONTEXT:
      return initialState;
  }
}, initialState);

export default contextMenuReducer;
