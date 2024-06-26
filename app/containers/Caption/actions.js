/*
 *
 * Caption actions
 *
 */

import { UPDATE_BACKGROUND } from './constants';

export function updateBackground(background) {
  return {
    type: UPDATE_BACKGROUND,
    background,
  };
}
