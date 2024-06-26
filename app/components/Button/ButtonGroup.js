import styled from 'styled-components';
import colors from 'styles/colors';

import ButtonContainer from './ButtonContainer';

export default styled.div`
  & ${ButtonContainer} {
    border-radius: 0;

    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }

    &:last-child {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }

    &:not(:first-child) {
      border-left: 1px solid ${colors.primaryDark};
    }
  }
`;
