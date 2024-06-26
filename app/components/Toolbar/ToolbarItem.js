import styled from 'styled-components';
import Button, { ButtonIcon } from 'components/Button';
import colors from 'styles/colors';

export default styled(Button)`
  height: 100%;
  background: transparent;
  border: none;
  border-radius: 0;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;

  &:hover,
  &:focus {
    background-color: ${colors.primary};
    color: ${colors.onPrimaryLight};
  }

  ${ButtonIcon}:last-child {
    float: right;
    margin-top: 0.2rem;
  }
`;
