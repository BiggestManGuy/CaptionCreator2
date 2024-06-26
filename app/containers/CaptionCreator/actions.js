/*
 *
 * CaptionCreator actions
 *
 */

import { UPDATE_CAPTION_ZOOM } from './constants';

export function updateCaptionZoom(zoom) {
  return {
    type: UPDATE_CAPTION_ZOOM,
    zoom,
  };
}
