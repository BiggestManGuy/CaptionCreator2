/**
 *
 * RadioSelect
 *
 */

import _uid from 'lodash/uniqueId';
import React from 'react';
import PropTypes from 'prop-types';

import RadioSelectContainer from './RadioSelectContainer';
import RadioSelectOption from './RadioSelectOption';

/* eslint-disable react/prefer-stateless-function */
class RadioSelect extends React.PureComponent {
  constructor(props) {
    super(props);

    this.radioGroup = _uid('radio-group_');
  }

  render() {
    const { options, selected, small, onSelect } = this.props;
    return (
      <RadioSelectContainer>
        {options.map(opt => (
          <RadioSelectOption
            key={opt.value}
            group={this.radioGroup}
            selected={opt.value === selected}
            small={small}
            onSelect={onSelect}
            option={opt}
          />
        ))}
      </RadioSelectContainer>
    );
  }
}

RadioSelect.propTypes = {
  options: PropTypes.array.isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  small: PropTypes.bool,
  onSelect: PropTypes.func,
};

RadioSelect.defaultProps = {
  small: false,
  onSelect: () => {},
};

export default RadioSelect;
