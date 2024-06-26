/*
 *
 * ContextMenu actions
 *
 */

import { CHANGE_CONTEXT, RESET_CONTEXT } from './constants';

export function changeContext(context, data = {}) {
  return {
    type: CHANGE_CONTEXT,
    context,
    data,
  };
}

export function resetContext() {
  return {
    type: RESET_CONTEXT,
  };
}
