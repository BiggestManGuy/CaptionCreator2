/*
 *
 * Caption reducer
 *
 */

import produce from 'immer';
import {
  BG_TYPE_SOLID,
  DEFAULT_COLOR,
  DEFAULT_GRADIENT,
} from 'components/BackgroundInput';
import { UPDATE_BACKGROUND } from './constants';

export const initialState = {
  width: 1280,
  height: 800, // auto
  background: {
    type: BG_TYPE_SOLID,
    color: DEFAULT_COLOR,
    gradient: DEFAULT_GRADIENT,
  },
};

/* eslint-disable default-case, no-param-reassign */
const captionReducer = produce((draft, action) => {
  switch (action.type) {
    case UPDATE_BACKGROUND:
      draft.background = action.background;
      break;
  }
}, initialState);

export default captionReducer;
