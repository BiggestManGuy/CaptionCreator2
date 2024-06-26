import { createSelector } from 'reselect';
import {
  makeSelectFormat,
  getFormatBoxBounds,
} from 'containers/CaptionFormats/selectors';
import {
  S_TOP,
  S_RIGHT,
  S_BOTTOM,
  S_LEFT,
} from 'containers/CaptionFormats/constants';
import { initialState, DEFAULT_IMAGE_ID } from './reducer';

/**
 * Direct selector to the captionImages state domain
 */

const selectCaptionImagesDomain = state => state.captionImages || initialState;

/**
 * Other specific selectors
 */

const makeSelectImageByID = () =>
  createSelector(
    selectCaptionImagesDomain,
    (state, { id = DEFAULT_IMAGE_ID }) => id,
    (substate, id) =>
      substate.images[id] || initialState.images[DEFAULT_IMAGE_ID],
  );

const makeSelectImageIDs = () =>
  createSelector(
    selectCaptionImagesDomain,
    substate => substate.imageIDs,
  );

const makeSelectImgFile = () =>
  createSelector(
    makeSelectImageByID(),
    substate => substate.file,
  );

const makeSelectImgNaturalWidth = () =>
  createSelector(
    makeSelectImageByID(),
    image => image.naturalWidth || undefined,
  );

const makeSelectImgNaturalWidthWithFormat = () =>
  createSelector(
    makeSelectImgNaturalWidth(),
    makeSelectFormat(),
    (naturalWidth, format) => {
      if (!naturalWidth) return undefined;
      const [left, right] = getFormatBoxBounds(format, [S_LEFT, S_RIGHT]);
      return naturalWidth + left + right;
    },
  );

const makeSelectImgNaturalHeight = () =>
  createSelector(
    makeSelectImageByID(),
    image => image.naturalHeight || undefined,
  );

const makeSelectImgNaturalHeightWithFormat = () =>
  createSelector(
    makeSelectImgNaturalHeight(),
    makeSelectFormat(),
    (naturalHeight, format) => {
      if (!naturalHeight) return undefined;
      const [top, bottom] = getFormatBoxBounds(format, [S_TOP, S_BOTTOM]);
      return naturalHeight + top + bottom;
    },
  );

const makeSelectImgRatioLock = () =>
  createSelector(
    makeSelectImageByID(),
    substate => substate.ratioLock,
  );

/**
 * Default selector used by CaptionImages
 */

const makeSelectImages = () =>
  createSelector(
    selectCaptionImagesDomain,
    makeSelectImageIDs(),
    (state, { ids }) => ids,
    ({ images }, imageIDs) => imageIDs.map(id => ({ id, ...images[id] })),
  );

export default makeSelectImages;

export {
  selectCaptionImagesDomain,
  makeSelectImageByID,
  makeSelectImageIDs,
  makeSelectImgFile,
  makeSelectImgNaturalWidth,
  makeSelectImgNaturalWidthWithFormat,
  makeSelectImgNaturalHeight,
  makeSelectImgNaturalHeightWithFormat,
  makeSelectImgRatioLock,
};
