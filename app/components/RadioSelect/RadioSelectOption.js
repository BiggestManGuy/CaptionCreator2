import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import colors from 'styles/colors';

const Container = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  overflow: hidden;
  user-select: none;

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
`;

const Radio = styled.input.attrs({
  type: 'radio',
})`
  position: absolute;
  opacity: 0;
  z-index: -1;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${props => (props.small ? '1.25rem' : '2rem')};
  line-height: ${props => (props.small ? '1.25rem' : '2rem')};
  padding: 0 ${props => (props.small ? '0.25rem' : '0.5rem')};
  font-size: ${props => (props.small ? '0.75rem' : '1rem')};
  color: ${colors.onPrimary};
  background-color: ${colors.primaryLight};
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s, color 0.2s;

  ${Radio}:checked + & {
    color: ${colors.onSecondaryLight};
    background-color: ${colors.secondary};
  }
`;

class RadioSelectOption extends React.PureComponent {
  onChange = () => {
    const { option, onSelect } = this.props;
    onSelect(option.value);
  };

  render() {
    const { group, option, small, selected } = this.props;
    const id = `${group}_${option.value}`;
    return (
      <Container>
        <Radio
          id={id}
          name={group}
          checked={selected}
          onChange={this.onChange}
        />
        <Label htmlFor={id} small={small}>
          {option.icon && <FontAwesomeIcon fixedWidth icon={option.icon} />}
          {option.label}
        </Label>
      </Container>
    );
  }
}

RadioSelectOption.propTypes = {
  group: PropTypes.string.isRequired,
  option: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  small: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

export default RadioSelectOption;
