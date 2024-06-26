/*
 *
 * ColorPicker reducer
 *
 */

import { pull } from 'lodash';
import produce from 'immer';
import { MAX_USED_COLORS, ADD_USED_COLOR } from './constants';

export const initialState = {
  usedColors: [],
};

/* eslint-disable default-case, no-param-reassign */
const colorPickerReducer = produce((draft, action) => {
  switch (action.type) {
    case ADD_USED_COLOR:
      pull(draft.usedColors, action.color);
      draft.usedColors.unshift(action.color);
      draft.usedColors = draft.usedColors.slice(0, MAX_USED_COLORS);
      break;
  }
}, initialState);

export default colorPickerReducer;
