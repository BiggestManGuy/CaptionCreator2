/*
 *
 * CaptionTextEditor reducer
 *
 */
import { pull } from 'lodash';
import produce from 'immer';
import {
  SELECTION_MODE_TEXT,
  ADD_EDITOR,
  DELETE_EDITOR,
  UPDATE_EDITOR_STATE,
  UPDATE_EDITOR_HEIGHT,
  SET_AUTO_HEIGHT,
  SET_SELECTION_MODE,
  SET_HIDE_SELECTION,
} from './constants';

import welcomeText from './welcomeText.hyperscript';

export const DEFAULT_EDITOR_ID = 'editor-default';

export const initialState = {
  editorIDs: [DEFAULT_EDITOR_ID],
  editors: {
    [DEFAULT_EDITOR_ID]: {
      autoHeight: true,
      selectionMode: SELECTION_MODE_TEXT,
      height: 0, // auto
      editorState: welcomeText,
      hideSelection: false,
    },
  },
};

/* eslint-disable default-case, no-param-reassign */
const captionReducer = produce((draft, action) => {
  switch (action.type) {
    case ADD_EDITOR:
      draft.editorIDs.push(action.id);
      draft.editors[action.id] = {
        selectionMode: SELECTION_MODE_TEXT,
        editorState: action.editorState,
      };
      break;
    case DELETE_EDITOR:
      pull(draft.editorIDs, action.id);
      delete draft.editors[action.id];
      break;
    case UPDATE_EDITOR_STATE:
      draft.editors[action.id].editorState = action.value;
      break;
    case UPDATE_EDITOR_HEIGHT:
      draft.editors[action.id].height = action.height;
      break;
    case SET_AUTO_HEIGHT:
      draft.editors[action.id].autoHeight = action.autoHeight;
      break;
    case SET_SELECTION_MODE:
      draft.editors[action.id].selectionMode = action.mode;
      break;
    case SET_HIDE_SELECTION:
      draft.editors[action.id].hideSelection = action.hide;
      break;
  }
}, initialState);

export default captionReducer;
