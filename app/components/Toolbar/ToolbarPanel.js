import styled from 'styled-components';
import colors from 'styles/colors';

export default styled.div`
  z-index: 1;
  display: flex;
  height: 2rem;
  pointer-events: auto;
  background: ${colors.primary};
  border: 1px solid ${colors.primaryExtraDark};
`;
