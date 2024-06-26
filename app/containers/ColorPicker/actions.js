/*
 *
 * ColorPicker actions
 *
 */

import { ADD_USED_COLOR } from './constants';

export function addUsedColor(color) {
  return {
    type: ADD_USED_COLOR,
    color: color.toLowerCase(),
  };
}
