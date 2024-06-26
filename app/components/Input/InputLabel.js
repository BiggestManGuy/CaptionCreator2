import styled from 'styled-components';
import colors from 'styles/colors';

export default styled.label`
  display: block;
  height: 0.75rem;
  margin: 0 0 0.5rem 6px;
  font-size: 0.75rem;
  color: ${props => (props.disabled ? colors.onPrimaryDark : colors.onPrimary)};
`;
