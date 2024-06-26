import { indexOf } from 'lodash';
import { createSelector } from 'reselect';
import { makeSelectCaptionZoom } from 'containers/CaptionCreator/selectors';
import { initialState } from './reducer';

const LAYER_NOT_FOUND = {
  id: undefined,
  name: undefined,
  x: undefined,
  y: undefined,
  width: undefined,
  height: undefined,
  background: undefined,
};

/**
 * Direct selector to the captionLayers state domain
 */

const selectCaptionLayersDomain = state => state.captionLayers || initialState;

/**
 * Other specific selectors
 */

const makeSelectLayerByID = () =>
  createSelector(
    selectCaptionLayersDomain,
    (state, { id }) => id,
    (substate, id) => substate.layers[id] || LAYER_NOT_FOUND,
  );

const makeSelectLayerIDs = () =>
  createSelector(
    selectCaptionLayersDomain,
    substate => substate.layerIDs,
  );

const makeSelectLayerNames = () =>
  createSelector(
    selectCaptionLayersDomain,
    substate => substate.layerNames,
  );

const makeSelectLayerName = () =>
  createSelector(
    makeSelectLayerNames(),
    (state, props) => props.id,
    (layerNames, id) => layerNames[id],
  );

const makeSelectLayerX = () =>
  createSelector(
    makeSelectLayerByID(),
    substate => substate.x,
  );

const makeSelectLayerY = () =>
  createSelector(
    makeSelectLayerByID(),
    substate => substate.y,
  );

const makeSelectLayerWidth = () =>
  createSelector(
    makeSelectLayerByID(),
    substate => substate.width,
  );

const makeSelectLayerHeight = () =>
  createSelector(
    makeSelectLayerByID(),
    substate => substate.height,
  );

const makeSelectLayerBackground = () =>
  createSelector(
    makeSelectLayerByID(),
    substate => substate.background,
  );

const makeSelectLayerOrder = () =>
  createSelector(
    makeSelectLayerIDs(),
    (state, props) => props.id,
    (layerIDs, id) => indexOf(layerIDs, id),
  );

const makeSelectIsActiveLayer = () =>
  createSelector(
    selectCaptionLayersDomain,
    (state, props) => props.id,
    (substate, id) => substate.activeLayerID === id,
  );

const makeSelectLayerScale = () =>
  createSelector(
    makeSelectCaptionZoom(),
    zoom => 1 / (zoom / 100),
  );

/**
 * Default selector used by CaptionLayers
 */

const makeSelectLayers = () =>
  createSelector(
    makeSelectLayerIDs(),
    selectCaptionLayersDomain,
    (layerIDs, substate) =>
      layerIDs.map(id => ({
        id,
        ...substate.layers[id],
      })),
  );

export default makeSelectLayers;
export {
  selectCaptionLayersDomain,
  makeSelectLayerByID,
  makeSelectLayerIDs,
  makeSelectLayerNames,
  makeSelectLayerName,
  makeSelectLayerX,
  makeSelectLayerY,
  makeSelectLayerWidth,
  makeSelectLayerHeight,
  makeSelectLayerBackground,
  makeSelectLayerOrder,
  makeSelectIsActiveLayer,
  makeSelectLayerScale,
};
