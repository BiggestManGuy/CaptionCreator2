/**
 *
 * Text
 *
 */

import styled from 'styled-components';
import colors from 'styles/colors';

const contextColor = props => {
  if (props.danger) return colors.textDanger;
  if (props.warning) return colors.textWarning;
  return colors.onPrimary;
};

export default styled.p`
  margin: 0;
  padding: 0;
  line-height: 1.4;
  font-size: 0.9rem;
  font-weight: normal;
  color: ${contextColor};
`;
