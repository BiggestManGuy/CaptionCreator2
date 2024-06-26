import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the sidemenu state domain
 */

const selectContextMenuDomain = state => state.contextMenu || initialState;

/**
 * Other specific selectors
 */

const makeSelectContext = () =>
  createSelector(
    selectContextMenuDomain,
    substate => substate.context,
  );

const makeSelectContextData = () =>
  createSelector(
    selectContextMenuDomain,
    substate => substate.data,
  );

/**
 * Default selector used by ContextMenu
 */

const makeSelectContextMenu = () =>
  createSelector(
    selectContextMenuDomain,
    substate => substate,
  );

export default makeSelectContextMenu;
export { selectContextMenuDomain, makeSelectContext, makeSelectContextData };
