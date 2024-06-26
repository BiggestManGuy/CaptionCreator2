import styled from 'styled-components';
import colors from 'styles/colors';

export default styled.div`
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    -45deg,
    ${colors.primary},
    ${colors.primary} 5px,
    ${colors.primaryDark} 5px,
    ${colors.primaryDark} 10px
  );
`;
