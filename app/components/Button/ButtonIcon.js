import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonText from './ButtonText';

export default styled(FontAwesomeIcon).attrs({
  fixedWidth: true,
})`
  ${ButtonText} + &, & + ${ButtonText} {
    margin-left: 6px;
  }
`;
