import { takeLatest, put } from 'redux-saga/effects';
import { addLayer } from 'containers/CaptionLayers/actions';
import { DELETE_LAYER } from 'containers/CaptionLayers/constants';
import { deleteImage } from './actions';
import { ADD_IMAGE } from './constants';

export function* onAddImage({ id, name }) {
  yield put(addLayer({ id, name, width: 640, height: 800 }));
}

export function* onDeleteLayer({ id }) {
  yield put(deleteImage(id));
}

export default function* captionImagesSaga() {
  yield takeLatest(ADD_IMAGE, onAddImage);
  yield takeLatest(DELETE_LAYER, onDeleteLayer);
}
