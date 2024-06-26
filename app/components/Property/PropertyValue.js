import styled from 'styled-components';

export default styled.div`
  display: inline-block;
  margin-left: 6px;
  line-height: ${props => (props.withInput ? '2rem' : 'initial')};
  font-size: 1rem;
  white-space: nowrap;
`;
