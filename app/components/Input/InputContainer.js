import styled from 'styled-components';

export default styled.div`
  display: block;

  &:focus-within {
    touch-action: ${props => (props.hasSpinner ? 'none' : 'auto')};
  }
`;
