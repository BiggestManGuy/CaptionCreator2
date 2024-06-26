/*
 *
 * CaptionFormat reducer
 *
 */

import produce from 'immer';
import { DEFAULT_IMAGE_ID } from 'containers/CaptionImages/reducer';
import { DEFAULT_EDITOR_ID } from 'containers/CaptionTextEditors/reducer';
import {
  S_TOP,
  S_RIGHT,
  S_BOTTOM,
  S_LEFT,
  F_PADDING,
  SET_SHOW_REGIONS,
  APPLY_FORMAT,
  CLEAR_FORMAT,
} from './constants';

export const DEFAULT_FORMAT_ID = 'format-default';

export const initialState = {
  options: {
    showRegions: { [DEFAULT_FORMAT_ID]: false, [DEFAULT_IMAGE_ID]: false },
  },
  formats: {
    [DEFAULT_EDITOR_ID]: {
      [S_TOP]: {
        [F_PADDING]: 10,
      },
      [S_RIGHT]: {
        [F_PADDING]: 10,
      },
      [S_BOTTOM]: {
        [F_PADDING]: 10,
      },
      [S_LEFT]: {
        [F_PADDING]: 10,
      },
    },
  },
};

/* eslint-disable default-case, no-param-reassign */
const captionFormatsReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_SHOW_REGIONS:
      draft.options.showRegions[action.id] = action.showRegions;
      break;
    case APPLY_FORMAT:
      draft.formats[action.id] = action.format;
      break;
    case CLEAR_FORMAT:
      delete draft.formats[action.id];
      break;
  }
}, initialState);

export default captionFormatsReducer;
