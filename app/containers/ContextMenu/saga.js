import { takeLatest, put } from 'redux-saga/effects';
import { setActiveLayer } from 'containers/CaptionLayers/actions';
import { DELETE_LAYER } from 'containers/CaptionLayers/constants';
import { changeContext } from './actions';
import {
  CHANGE_CONTEXT,
  MENU_CONTEXT_CAPTION,
  MENU_CONTEXT_IMAGE,
  MENU_CONTEXT_TEXT,
} from './constants';

export function* onContextChange({ context, data }) {
  switch (context) {
    case MENU_CONTEXT_IMAGE:
    case MENU_CONTEXT_TEXT:
      yield put(setActiveLayer(data.id));
      break;
    default:
      yield put(setActiveLayer(null));
      break;
  }
}

export function* onDeleteLayer() {
  yield put(changeContext(MENU_CONTEXT_CAPTION));
}

export default function* contextMenuSaga() {
  yield takeLatest(CHANGE_CONTEXT, onContextChange);
  yield takeLatest(DELETE_LAYER, onDeleteLayer);
}
