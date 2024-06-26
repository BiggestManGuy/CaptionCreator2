/**
 *
 * Asynchronously loads the component for CaptionImages
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
