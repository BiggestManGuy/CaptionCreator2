import queries from 'components/TextEditor/queries';

import { createSelector } from 'reselect';
import { initialState, DEFAULT_EDITOR_ID } from './reducer';

/**
 * Direct selector to the captionTextEditor state domain
 */

const selectCaptionTextEditorDomain = state =>
  state.captionTextEditors || initialState;

/**
 * Other specific selectors
 */

const makeSelectEditorByID = () =>
  createSelector(
    selectCaptionTextEditorDomain,
    (state, { id = DEFAULT_EDITOR_ID }) => id,
    (substate, id) =>
      substate.editors[id] || initialState.editors[DEFAULT_EDITOR_ID],
  );

const makeSelectEditorIDs = () =>
  createSelector(
    selectCaptionTextEditorDomain,
    substate => substate.editorIDs,
  );

const makeSelectEditorState = () =>
  createSelector(
    makeSelectEditorByID(),
    substate => substate.editorState,
  );

const makeSelectEditorHeight = () =>
  createSelector(
    makeSelectEditorByID(),
    substate => substate.height,
  );

const makeSelectEditorFormat = format =>
  createSelector(
    makeSelectEditorState(),
    editorState => queries.getFormat({ value: editorState }, format),
  );

const makeSelectEditorAutoHeight = () =>
  createSelector(
    makeSelectEditorByID(),
    substate => substate.autoHeight,
  );

const makeSelectEditorSelectionMode = () =>
  createSelector(
    makeSelectEditorByID(),
    substate => substate.selectionMode,
  );

const makeSelectEditorHideSelection = () =>
  createSelector(
    makeSelectEditorByID(),
    substate => substate.hideSelection,
  );

/**
 * Default selector used by CaptionTextEditor
 */

const makeSelectEditors = () =>
  createSelector(
    makeSelectEditorIDs(),
    selectCaptionTextEditorDomain,
    (editorIDs, substate) =>
      editorIDs.map(id => ({
        id,
        ...substate.editors[id],
      })),
  );

export default makeSelectEditors;
export {
  selectCaptionTextEditorDomain,
  makeSelectEditorByID,
  makeSelectEditorIDs,
  makeSelectEditorState,
  makeSelectEditorHeight,
  makeSelectEditorFormat,
  makeSelectEditorAutoHeight,
  makeSelectEditorSelectionMode,
  makeSelectEditorHideSelection,
};
