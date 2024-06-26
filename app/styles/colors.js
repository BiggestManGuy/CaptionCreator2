// TODO: Use ThemeProvider instead of importing into each component.

import _ from 'lodash';
import hex2RGB from './hex2RGB';

const colors = {
  primary: '#1f1f1f',
  primaryDark: '#111111',
  primaryExtraDark: '#000000',
  primaryLight: '#494949',
  onPrimary: '#bababa',
  onPrimaryDark: '#888888',
  onPrimaryLight: '#ffffff',
  secondary: '#0b59b8',
  secondaryLight: '#0e71eb',
  secondaryDark: '#06346b',
  onSecondaryDark: '#aaaaaa',
  onSecondary: '#dddddd',
  onSecondaryLight: '#ffffff',
  danger: '#c62828',
  dangerDark: '#7a1818',
  onDanger: '#dddddd',
  onDangerDark: '#aaaaaa',
  onDangerLight: '#ffffff',
  textDanger: '#e57373',
  textWarning: '#ffd54f',
  captionBgSolidDefault: '#ffffff',
  captionBgGradStartDefault: '#ffffff',
  captionBgGradEndDefault: '#ffffe6',
};

export { colors as hex };
export const rgb = _.mapValues(colors, hex2RGB);

export default colors;
