import styled from 'styled-components';
import colors from 'styles/colors';

export default styled.input`
  flex: 1;
  flex-basis: auto;
  width: 0%;
  height: 2rem;
  margin: 0;
  padding: 0 0.5rem;
  text-align: ${props => props.align};
  font-size: 1rem;
  color: ${colors.onPrimary};
  background-color: ${colors.primaryLight};
  border: none;
  border-radius: 6px;

  &::placeholder {
    opacity: 0.75;
    color: ${colors.onPrimary};
  }

  &:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  &:focus,
  &:invalid {
    outline: none;
    box-shadow: none;
  }

  &[disabled] {
    opacity: 1;
    color: ${colors.onPrimaryDark};
    -webkit-text-fill-color: ${colors.onPrimaryDark};
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }
  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
