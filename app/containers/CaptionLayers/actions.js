/*
 *
 * CaptionLayers actions
 *
 */

import { v1 as uuid } from 'uuid';
import {
  BG_TYPE_NONE,
  DEFAULT_COLOR,
  DEFAULT_GRADIENT,
} from 'components/BackgroundInput';
import {
  ADD_LAYER,
  DELETE_LAYER,
  UPDATE_LAYER_ORDER,
  UPDATE_LAYER_NAME,
  UPDATE_LAYER_X,
  UPDATE_LAYER_Y,
  UPDATE_LAYER_WIDTH,
  UPDATE_LAYER_HEIGHT,
  UPDATE_LAYER_BACKGROUND,
  SET_ACTIVE_LAYER,
} from './constants';

export function addLayer({
  id = uuid(),
  name,
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  background = {
    type: BG_TYPE_NONE,
    color: DEFAULT_COLOR,
    gradient: DEFAULT_GRADIENT,
  },
}) {
  return {
    type: ADD_LAYER,
    id,
    name,
    x,
    y,
    width,
    height,
    background,
  };
}

export function deleteLayer(id) {
  return {
    type: DELETE_LAYER,
    id,
  };
}

export function updateLayerOrder(id, order) {
  return {
    type: UPDATE_LAYER_ORDER,
    id,
    order,
  };
}

export function updateLayerName(id, name) {
  return {
    type: UPDATE_LAYER_NAME,
    id,
    name,
  };
}

export function updateLayerX(id, x) {
  return {
    type: UPDATE_LAYER_X,
    id,
    x,
  };
}

export function updateLayerY(id, y) {
  return {
    type: UPDATE_LAYER_Y,
    id,
    y,
  };
}

export function updateLayerWidth(id, width) {
  return {
    type: UPDATE_LAYER_WIDTH,
    id,
    width,
  };
}

export function updateLayerHeight(id, height) {
  return {
    type: UPDATE_LAYER_HEIGHT,
    id,
    height,
  };
}

export function updateLayerBackground(id, background) {
  return {
    type: UPDATE_LAYER_BACKGROUND,
    id,
    background,
  };
}

export function setActiveLayer(id) {
  return {
    type: SET_ACTIVE_LAYER,
    id,
  };
}
