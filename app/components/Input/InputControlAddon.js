import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from 'styles/colors';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 0.5rem;
  color: ${props => (props.disabled ? colors.onPrimaryDark : colors.onPrimary)};
  background-color: ${colors.primaryLight};
  user-select: none;
  white-space: nowrap;

  &:first-child {
    margin-right: -0.5rem;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  &:last-child {
    margin-left: -0.5rem;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

function InputControlAddon({ children, icon, disabled, ...props }) {
  return (
    <Container disabled={disabled} {...props}>
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </Container>
  );
}

InputControlAddon.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.object,
  disabled: PropTypes.bool,
};

export default InputControlAddon;
