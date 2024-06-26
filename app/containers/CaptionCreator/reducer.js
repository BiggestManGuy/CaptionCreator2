/*
 *
 * CaptionCreator reducer
 *
 */

import produce from 'immer';
import { UPDATE_CAPTION_ZOOM } from './constants';

export const initialState = {
  zoom: 100,
};

/* eslint-disable default-case, no-param-reassign */
const captionCreatorReducer = produce((draft, action) => {
  switch (action.type) {
    case UPDATE_CAPTION_ZOOM:
      draft.zoom = action.zoom;
      break;
  }
}, initialState);

export default captionCreatorReducer;
