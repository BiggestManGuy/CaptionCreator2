import styled from 'styled-components';

export default styled.div.attrs(({ x = 0, y = 0 }) => ({
  style: {
    left: x,
    top: y,
  },
}))`
  position: absolute;
  overflow: hidden;
  pointer-events: auto;
`;
