/*
 *
 * CaptionTextEditor actions
 *
 */

import { v1 as uuid } from 'uuid';
import {
  ADD_EDITOR,
  DELETE_EDITOR,
  UPDATE_EDITOR_STATE,
  UPDATE_EDITOR_HEIGHT,
  SET_AUTO_HEIGHT,
  SET_SELECTION_MODE,
  SET_HIDE_SELECTION,
} from './constants';

import generateDefaultText from './generateDefaultText.hyperscript';

export function generateTextEditorID() {
  return uuid();
}

export function addEditor({
  id = generateTextEditorID(),
  name = 'Caption Text',
  editorState = generateDefaultText(name),
}) {
  return {
    type: ADD_EDITOR,
    id,
    name,
    editorState,
  };
}

export function deleteEditor(id) {
  return {
    type: DELETE_EDITOR,
    id,
  };
}

export function updateEditorState(id, value) {
  return {
    type: UPDATE_EDITOR_STATE,
    id,
    value,
  };
}

export function updateEditorHeight(id, height) {
  return {
    type: UPDATE_EDITOR_HEIGHT,
    id,
    height,
  };
}

export function setAutoHeight(id, autoHeight) {
  return {
    type: SET_AUTO_HEIGHT,
    id,
    autoHeight,
  };
}

export function setSelectionMode(id, mode) {
  return {
    type: SET_SELECTION_MODE,
    id,
    mode,
  };
}

export function setHideSelection(id, hide) {
  return {
    type: SET_HIDE_SELECTION,
    id,
    hide,
  };
}
