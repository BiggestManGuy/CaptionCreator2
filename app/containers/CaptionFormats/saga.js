import { takeLatest, put } from 'redux-saga/effects';
import { DELETE_LAYER } from 'containers/CaptionLayers/constants';
import { clearFormat } from './actions';

export function* onDeleteLayer({ id }) {
  yield put(clearFormat(id));
}

export default function* captionFormatsSaga() {
  yield takeLatest(DELETE_LAYER, onDeleteLayer);
}
