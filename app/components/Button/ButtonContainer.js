/* eslint-disable indent */

import styled from 'styled-components';
import colors from 'styles/colors';

export default styled.button`
  display: inline-block;
  height: ${props => (props.small ? '1.25rem' : '2rem')};
  padding: 0 ${props => (props.small ? '0.25rem' : '0.5rem')};
  float: ${props => {
    if (props.pullLeft) return 'left';
    if (props.pullRight) return 'right';
    return 'none';
  }};
  font-size: ${props => (props.small ? '0.75rem' : '1rem')};
  text-align: center;
  color: ${({ active, primary, danger }) => {
    if (active) return colors.onSecondaryLight;
    if (primary) return colors.onSecondary;
    if (danger) return colors.onDanger;
    return colors.onPrimary;
  }};
  background-color: ${({ active, primary, danger }) => {
    if (active || primary) return colors.secondary;
    if (danger) return colors.danger;
    return colors.primaryLight;
  }};
  border: none;
  border-radius: 6px;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
  user-select: none;

  & {
    :hover,
    :focus {
      color: ${({ active, danger }) => {
        if (active) return colors.onSecondaryLight;
        if (danger) return colors.onDangerLight;
        return colors.onPrimaryLight;
      }};
      outline: none;
    }
  }

  &[disabled] {
    cursor: not-allowed;
    color: ${({ active, primary, danger }) => {
      if (active || primary) return colors.onSecondaryDark;
      if (danger) return colors.onDangerDark;
      return colors.onPrimaryDark;
    }};
    background: ${({ primary, danger }) => {
      if (primary) return colors.secondaryDark;
      if (danger) return colors.dangerDark;
      return '';
    }};
  }
`;
