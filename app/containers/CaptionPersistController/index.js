/**
 *
 * CaptionPersistController
 *
 */

import createPersistController from 'utils/persistStorageController';

const { PersistStorageController, Context, Storage } = createPersistController({
  name: 'captions',
  api: {
    currentStoreKey: 'currentCaption',
    storesKey: 'savedCaptions',
    saveKey: 'saveCaption',
    loadKey: 'loadCaption',
    deleteKey: 'deleteCaption',
  },
});

export { Context as CaptionPersistContext };
export { Storage as CaptionPersistStorage };
export default PersistStorageController;
