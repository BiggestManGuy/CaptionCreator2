import { merge } from 'lodash';
import { createSelector } from 'reselect';
import { initialState, DEFAULT_FORMAT_ID } from './reducer';

import {
  S_TOP,
  S_RIGHT,
  S_BOTTOM,
  S_LEFT,
  C_TOP_LEFT,
  C_TOP_RIGHT,
  C_BOTTOM_RIGHT,
  C_BOTTOM_LEFT,
  F_MARGIN,
  F_PADDING,
  F_BORDER_RADIUS,
  F_BORDER_WIDTH,
  F_BORDER_COLOR,
} from './constants';

const defaultFormat = {
  [S_TOP]: {
    [F_MARGIN]: 0,
    [F_PADDING]: 0,
    [F_BORDER_COLOR]: '#ffffff',
    [F_BORDER_WIDTH]: 0,
  },
  [S_RIGHT]: {
    [F_MARGIN]: 0,
    [F_PADDING]: 0,
    [F_BORDER_COLOR]: '#ffffff',
    [F_BORDER_WIDTH]: 0,
  },
  [S_BOTTOM]: {
    [F_MARGIN]: 0,
    [F_PADDING]: 0,
    [F_BORDER_COLOR]: '#ffffff',
    [F_BORDER_WIDTH]: 0,
  },
  [S_LEFT]: {
    [F_MARGIN]: 0,
    [F_PADDING]: 0,
    [F_BORDER_COLOR]: '#ffffff',
    [F_BORDER_WIDTH]: 0,
  },
  [C_TOP_LEFT]: {
    [F_BORDER_RADIUS]: 0,
  },
  [C_TOP_RIGHT]: {
    [F_BORDER_RADIUS]: 0,
  },
  [C_BOTTOM_LEFT]: {
    [F_BORDER_RADIUS]: 0,
  },
  [C_BOTTOM_RIGHT]: {
    [F_BORDER_RADIUS]: 0,
  },
};

/**
 * Direct selector to the captionFormats state domain
 */

const selectCaptionFormatsDomain = state =>
  state.captionFormats || initialState;

/**
 * Other specific selectors
 */

const selectOptions = state => selectCaptionFormatsDomain(state).options;

const makeSelectShowRegions = () =>
  createSelector(
    selectOptions,
    (_, props = {}) => props.id,
    (substate, id = DEFAULT_FORMAT_ID) => substate.showRegions[id],
  );

const makeSelectFormat = () =>
  createSelector(
    selectCaptionFormatsDomain,
    (_, props = {}) => props.id,
    (substate, id = DEFAULT_FORMAT_ID) =>
      merge({}, defaultFormat, substate.formats[id]),
  );

const makeSelectFormats = () =>
  createSelector(
    selectCaptionFormatsDomain,
    ({ formats }) =>
      Object.keys(formats).map(id => ({
        id,
        ...merge({}, defaultFormat, formats[id]),
      })),
  );

const makeSelectFormatBoxBounds = sides =>
  createSelector(
    makeSelectFormat(),
    format => getFormatBoxBounds(format, sides),
  );

/**
 * Default selector used by CaptionFormats
 */

const makeSelectCaptionFormats = () =>
  createSelector(
    selectCaptionFormatsDomain,
    substate => substate,
  );

/**
 * Helpers
 */

const getMargin = (formats, side) => formats[side][F_MARGIN];
const getPadding = (formats, side) => formats[side][F_PADDING];
const getBorderColor = (formats, side) => formats[side][F_BORDER_COLOR];
const getBorderWidth = (formats, side) => formats[side][F_BORDER_WIDTH];
const getBorderRadius = (formats, corner) => formats[corner][F_BORDER_RADIUS];

const getFormatBoxBounds = (
  format = defaultFormat,
  sides = [S_TOP, S_RIGHT, S_BOTTOM, S_LEFT],
) =>
  sides.map(side =>
    [getMargin, getPadding, getBorderWidth].reduce(
      (total, getter) => total + getter(format, side),
      0,
    ),
  );

/**
 * Gets the common value from an array of format targets, or fallback if none.
 * @param {Object} formats
 * @param {String[]} targets
 * @param {Function} getter
 * @param {*} [fallback]
 * @returns {*}
 */
const getCommonFormat = (formats, targets, getter, fallback = null) => {
  if (targets.length === 0) return fallback;

  const value = getter(formats, targets[0]);
  const isCommon = targets.every(side => value === getter(formats, side));

  if (isCommon) return value;
  return fallback;
};

export default makeSelectCaptionFormats;
export {
  selectCaptionFormatsDomain,
  makeSelectShowRegions,
  makeSelectFormat,
  makeSelectFormats,
  makeSelectFormatBoxBounds,
  getMargin,
  getPadding,
  getBorderColor,
  getBorderWidth,
  getBorderRadius,
  getFormatBoxBounds,
  getCommonFormat,
};
