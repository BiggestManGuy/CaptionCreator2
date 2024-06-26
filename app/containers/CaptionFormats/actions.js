/*
 *
 * CaptionFormats actions
 *
 */

import { SET_SHOW_REGIONS, APPLY_FORMAT, CLEAR_FORMAT } from './constants';

import { DEFAULT_FORMAT_ID } from './reducer';

export function setShowRegions(id = DEFAULT_FORMAT_ID, showRegions) {
  return {
    type: SET_SHOW_REGIONS,
    id,
    showRegions,
  };
}

export function applyFormat(id = DEFAULT_FORMAT_ID, format = {}) {
  return {
    type: APPLY_FORMAT,
    id,
    format,
  };
}

export function clearFormat(id = DEFAULT_FORMAT_ID) {
  return {
    type: CLEAR_FORMAT,
    id,
  };
}
