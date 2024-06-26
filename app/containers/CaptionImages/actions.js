/*
 *
 * CaptionImages actions
 *
 */
import { v1 as uuid } from 'uuid';

import {
  ADD_IMAGE,
  DELETE_IMAGE,
  UPDATE_IMG_FILE,
  SET_IMG_NATURAL_WIDTH,
  SET_IMG_NATURAL_HEIGHT,
  SET_IMG_RATIO_LOCK,
} from './constants';

export function generateImageID() {
  return uuid();
}

export function addImage({
  id = generateImageID(),
  name,
  file = null,
  naturalWidth = null,
  naturalHeight = null,
  ratioLock = true,
}) {
  return {
    type: ADD_IMAGE,
    id,
    name,
    file,
    naturalWidth,
    naturalHeight,
    ratioLock,
  };
}

export function deleteImage(id) {
  return {
    type: DELETE_IMAGE,
    id,
  };
}

export function updateImgFile(id, file) {
  return {
    type: UPDATE_IMG_FILE,
    id,
    file,
  };
}

export function setImgNaturalWidth(id, width) {
  return {
    type: SET_IMG_NATURAL_WIDTH,
    id,
    width,
  };
}

export function setImgNaturalHeight(id, height) {
  return {
    type: SET_IMG_NATURAL_HEIGHT,
    id,
    height,
  };
}

export function setImgRatioLock(id, lock) {
  return {
    type: SET_IMG_RATIO_LOCK,
    id,
    lock,
  };
}
