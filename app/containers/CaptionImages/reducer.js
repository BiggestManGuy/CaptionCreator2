/*
 *
 * CaptionImages reducer
 *
 */

import { pull } from 'lodash';
import produce from 'immer';
import {
  ADD_IMAGE,
  DELETE_IMAGE,
  UPDATE_IMG_FILE,
  SET_IMG_NATURAL_WIDTH,
  SET_IMG_NATURAL_HEIGHT,
  SET_IMG_RATIO_LOCK,
} from './constants';

export const DEFAULT_IMAGE_ID = 'image-default';

export const initialState = {
  imageIDs: [DEFAULT_IMAGE_ID],
  images: {
    [DEFAULT_IMAGE_ID]: {
      file: null,
      naturalWidth: null,
      naturalHeight: null,
      ratioLock: true,
    },
  },
};

/* eslint-disable default-case, no-param-reassign */
const captionImagesReducer = produce((draft, action) => {
  const image = draft.images[action.id];
  switch (action.type) {
    case ADD_IMAGE:
      draft.imageIDs.push(action.id);
      draft.images[action.id] = {
        file: action.file,
        naturalWidth: action.naturalWidth,
        naturalHeight: action.naturalHeight,
        ratioLock: action.ratioLock,
      };
      break;
    case DELETE_IMAGE:
      pull(draft.imageIDs, action.id);
      delete draft.images[action.id];
      break;
    case UPDATE_IMG_FILE:
      if (image) {
        image.file = action.file;
      }
      break;
    case SET_IMG_NATURAL_WIDTH:
      if (image) {
        image.naturalWidth = action.width;
      }
      break;
    case SET_IMG_NATURAL_HEIGHT:
      if (image) {
        image.naturalHeight = action.height;
      }
      break;
    case SET_IMG_RATIO_LOCK:
      if (image) {
        image.ratioLock = action.lock;
      }
      break;
  }
}, initialState);

export default captionImagesReducer;
