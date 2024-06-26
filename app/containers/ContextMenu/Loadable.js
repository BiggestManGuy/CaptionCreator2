/**
 *
 * Asynchronously loads the component for ContextMenu
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
