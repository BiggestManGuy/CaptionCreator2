import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the captionCreator state domain
 */

const selectCaptionCreatorDomain = state =>
  state.captionCreator || initialState;

/**
 * Other specific selectors
 */

const makeSelectCaptionZoom = () =>
  createSelector(
    selectCaptionCreatorDomain,
    substate => substate.zoom,
  );

export { selectCaptionCreatorDomain, makeSelectCaptionZoom };
