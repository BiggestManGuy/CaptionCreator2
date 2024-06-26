/**
 *
 * Asynchronously loads the component for MainMenu
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
