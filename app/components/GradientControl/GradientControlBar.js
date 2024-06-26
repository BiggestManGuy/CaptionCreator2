import styled from 'styled-components';
import colors from 'styles/colors';

import Checkerboard from 'components/Checkerboard';

export default styled(Checkerboard).attrs(props => ({
  style: {
    background: props.gradient,
  },
}))`
  height: 2rem;
  border: 1px solid ${colors.primaryDark};
  border-radius: 6px;
`;
