/*
 *
 * CaptionLayers reducer
 *
 */

import { indexOf, pull } from 'lodash';
import produce from 'immer';
import {
  BG_TYPE_NONE,
  DEFAULT_COLOR,
  DEFAULT_GRADIENT,
} from 'components/BackgroundInput';
import { DEFAULT_IMAGE_ID } from 'containers/CaptionImages/reducer';
import { DEFAULT_EDITOR_ID } from 'containers/CaptionTextEditors/reducer';
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

export const initialState = {
  activeLayerID: null,
  layerIDs: [DEFAULT_IMAGE_ID, DEFAULT_EDITOR_ID],
  // Prevent wasteful re-renders for components that only need the layer name.
  layerNames: {
    [DEFAULT_IMAGE_ID]: 'Caption Image',
    [DEFAULT_EDITOR_ID]: 'Caption Text',
  },
  layers: {
    [DEFAULT_IMAGE_ID]: {
      name: 'Caption Image',
      x: 0,
      y: 0,
      width: 640,
      height: 800,
      background: {
        type: BG_TYPE_NONE,
        color: DEFAULT_COLOR,
        gradient: DEFAULT_GRADIENT,
      },
    },
    [DEFAULT_EDITOR_ID]: {
      name: 'Caption Text',
      x: 640,
      y: 0,
      width: 640,
      height: 0, // auto
      background: {
        type: BG_TYPE_NONE,
        color: DEFAULT_COLOR,
        gradient: DEFAULT_GRADIENT,
      },
    },
  },
};

/* eslint-disable default-case, no-param-reassign */
const captionLayersReducer = produce((draft, action) => {
  switch (action.type) {
    case ADD_LAYER:
      draft.layerIDs.unshift(action.id);
      draft.layerNames[action.id] = action.name;
      draft.layers[action.id] = {
        name: action.name,
        x: action.x,
        y: action.y,
        width: action.width,
        height: action.height,
        background: action.background,
      };
      break;
    case DELETE_LAYER:
      pull(draft.layerIDs, action.id);
      pull(draft.layerNames, action.id);
      delete draft.layers[action.id];
      break;
    case UPDATE_LAYER_ORDER:
      draft.layerIDs.splice(indexOf(draft.layerIDs, action.id), 1);
      draft.layerIDs.splice(action.order, 0, action.id);
      break;
    case UPDATE_LAYER_NAME:
      draft.layerNames[action.id] = action.name;
      draft.layers[action.id].name = action.name;
      break;
    case UPDATE_LAYER_X:
      draft.layers[action.id].x = action.x;
      break;
    case UPDATE_LAYER_Y:
      draft.layers[action.id].y = action.y;
      break;
    case UPDATE_LAYER_WIDTH:
      draft.layers[action.id].width = action.width;
      break;
    case UPDATE_LAYER_HEIGHT:
      draft.layers[action.id].height = action.height;
      break;
    case UPDATE_LAYER_BACKGROUND:
      draft.layers[action.id].background = action.background;
      break;
    case SET_ACTIVE_LAYER:
      draft.activeLayerID = action.id;
      break;
  }
}, initialState);

export default captionLayersReducer;
