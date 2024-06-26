import makeSelectLayers from 'containers/CaptionLayers/selectors';
import { makeSelectFormatBoxBounds } from 'containers/CaptionFormats/selectors';
import {
  S_TOP,
  S_RIGHT,
  S_BOTTOM,
  S_LEFT,
} from 'containers/CaptionFormats/constants';
import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the caption state domain
 */

const selectCaptionDomain = state => state.caption || initialState;

/**
 * Other specific selectors
 */

const makeSelectCaptionWidth = () =>
  createSelector(
    makeSelectLayers(),
    makeSelectFormatBoxBounds([S_LEFT, S_RIGHT]),
    (layers, [left, right]) => {
      const layerWidth = layers.reduce(
        (width, layer) => Math.max(width, layer.x + layer.width),
        0,
      );
      return Math.round(layerWidth + left + right);
    },
  );

const makeSelectCaptionHeight = () =>
  createSelector(
    makeSelectLayers(),
    makeSelectFormatBoxBounds([S_TOP, S_BOTTOM]),
    (layers, [top, bottom]) => {
      const layerHeight = layers.reduce(
        (height, layer) => Math.max(height, layer.y + layer.height),
        0,
      );
      return Math.round(layerHeight + top + bottom);
    },
  );

const makeSelectBackground = () =>
  createSelector(
    selectCaptionDomain,
    substate => substate.background,
  );

export {
  selectCaptionDomain,
  makeSelectCaptionWidth,
  makeSelectCaptionHeight,
  makeSelectBackground,
};
