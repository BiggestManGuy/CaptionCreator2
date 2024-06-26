import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the ColorPicker state domain
 */

const selectColorPickerDomain = state => state.colorPicker || initialState;

/**
 * Other specific selectors
 */

const makeSelectUsedColors = () =>
  createSelector(
    selectColorPickerDomain,
    substate => substate.usedColors,
  );

/**
 * Default selector used by ColorPicker
 */

const makeSelectColorPicker = () =>
  createSelector(
    selectColorPickerDomain,
    substate => substate,
  );

export default makeSelectColorPicker;
export { makeSelectUsedColors };
