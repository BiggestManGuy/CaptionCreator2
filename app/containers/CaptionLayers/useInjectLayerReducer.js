import { CaptionPersistStorage } from 'containers/CaptionPersistController';
import { useInjectPersistedReducer } from 'utils/injectPersistedReducer';
import reducer from './reducer';

export default function useInjectLayerReducer() {
  useInjectPersistedReducer({
    key: 'captionLayers',
    reducer,
    storage: CaptionPersistStorage,
    blacklist: ['activeLayerID'],
  });
}
