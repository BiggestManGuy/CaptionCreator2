import { takeLatest, put } from 'redux-saga/effects';
import { addLayer } from 'containers/CaptionLayers/actions';
import { DELETE_LAYER } from 'containers/CaptionLayers/constants';
import { deleteEditor } from './actions';
import { ADD_EDITOR } from './constants';

export function* onAddEditor({ id, name }) {
  yield put(addLayer({ id, name, width: 640 }));
}

export function* onDeleteLayer({ id }) {
  yield put(deleteEditor(id));
}

export default function* captionTextEditorsSaga() {
  yield takeLatest(ADD_EDITOR, onAddEditor);
  yield takeLatest(DELETE_LAYER, onDeleteLayer);
}
