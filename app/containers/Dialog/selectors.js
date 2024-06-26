import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the dialog state domain
 */

const selectDialogDomain = state => state.dialog || initialState;

/**
 * Other specific selectors
 */

const makeSelectDialogIsOpen = () =>
  createSelector(
    selectDialogDomain,
    substate => substate.isOpen,
  );

const makeSelectCurrentDialog = () =>
  createSelector(
    selectDialogDomain,
    substate => substate.dialog,
  );

const makeSelectDialogProps = () =>
  createSelector(
    selectDialogDomain,
    substate => substate.props,
  );

const makeSelectDialogLocked = () =>
  createSelector(
    selectDialogDomain,
    substate => substate.isLocked,
  );

/**
 * Default selector used by Dialog
 */

const makeSelectDialog = () =>
  createSelector(
    selectDialogDomain,
    substate => substate,
  );

export default makeSelectDialog;
export {
  selectDialogDomain,
  makeSelectDialogIsOpen,
  makeSelectCurrentDialog,
  makeSelectDialogProps,
  makeSelectDialogLocked,
};
