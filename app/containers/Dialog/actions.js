/*
 *
 * Dialog actions
 *
 */

import { DIALOG_OPEN, DIALOG_CLOSE, DIALOG_SET_LOCK } from './constants';

export function openDialog(dialog, props = {}, { isLocked = false } = {}) {
  return {
    type: DIALOG_OPEN,
    dialog,
    props,
    isLocked,
  };
}

export function closeDialog() {
  return {
    type: DIALOG_CLOSE,
  };
}

export function setDialogLock(isLocked) {
  return {
    type: DIALOG_SET_LOCK,
    isLocked,
  };
}
