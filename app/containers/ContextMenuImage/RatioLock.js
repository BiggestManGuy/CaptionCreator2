import styled from 'styled-components';
import { faLink, faUnlink } from '@fortawesome/free-solid-svg-icons';

import Button from 'components/Button';
import colors from 'styles/colors';

export default styled(Button).attrs(props => ({
  icon: props.locked ? faLink : faUnlink,
}))`
  padding-left: 0;
  padding-right: 0;
  color: ${colors.onPrimary};
  background-color: transparent;
  border: none;

  &:hover,
  &:focus {
    color: ${colors.onPrimaryLight};
    background-color: transparent;
  }
`;
