/**
 *
 * DropdownSelect
 *
 */

import { uniqueId as uid } from 'lodash';
import React, { memo, useRef } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import PropTypes from 'prop-types';

import Select from 'react-select';
import colors from 'styles/colors';
import DropdownSelectLabel from 'components/Input/InputLabel';
import DropdownSelectContainer from './DropdownSelectContainer';

function DropdownSelect({
  label,
  selectedValue,
  selectedLabel,
  disabled = false,
  optionStyle = () => {},
  ...props
}) {
  const inputId = useRef(uid('dropdown-select_'));

  // Hack to reposition the dropdown menu when the window dimensions change.
  // The most egregious case being when the soft keyboard appears and covers the
  // menu.
  useWindowSize();

  const selectStyle = {
    container: base => ({
      ...base,
      pointerEvents: 'auto',
    }),
    control: (base, state) => ({
      ...base,
      height: '2rem',
      minHeight: 0,
      border: 'none',
      borderRadius: 6,
      color: colors.primaryLight,
      backgroundColor: colors.primaryLight,
      boxShadow: 'none',
      cursor: state.isDisabled ? 'not-allowed' : 'auto',
    }),
    valueContainer: base => ({
      ...base,
      padding: '0 0.5rem',
    }),
    indicatorSeparator: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled
        ? colors.onPrimaryDark
        : colors.onPrimary,
    }),
    dropdownIndicator: (base, state) => ({
      padding: '0 0.5rem',
      color: state.isDisabled ? colors.onPrimaryDark : colors.onPrimary,
    }),
    input: (base, state) => ({
      ...base,
      display: 'flex',
      alignItems: 'center',
      height: '2rem',
      margin: 0,
      padding: 0,
      color: state.isDisabled ? colors.onPrimaryDark : colors.onPrimary,
      '&:focus': {
        outline: 'none',
      },
    }),
    placeholder: base => ({
      ...base,
      color: colors.onPrimary,
    }),
    singleValue: (base, state) => ({
      ...base,
      margin: 0,
      paddingRight: '0.5rem',
      color: state.isDisabled ? colors.onPrimaryDark : colors.onPrimary,
    }),
    menuPortal: base => ({
      ...base,
      zIndex: 999,
    }),
    menu: base => ({
      ...base,
      maxHeight: '9rem',
      backgroundColor: colors.primaryLight,
      border: `1px solid ${colors.primaryExtraDark}`,
      borderRadius: 6,
      overflow: 'hidden',
    }),
    menuList: base => ({
      ...base,
      maxHeight: '9rem',
      padding: '0.5rem 0',
    }),
    option: (base, state) => ({
      ...base,
      display: 'flex',
      alignItems: 'center',
      minHeight: '2rem',
      padding: '0.5rem',
      color:
        state.isFocused || state.isSelected
          ? colors.onSecondaryLight
          : colors.onPrimary,
      backgroundColor: (() => {
        if (state.isSelected) return colors.secondary;
        if (state.isFocused) return colors.secondaryLight;
        return 'transparent';
      })(),
      '&:active': {
        backgroundColor: colors.secondaryLight,
      },
      ...optionStyle(state),
    }),
    noOptionsMessage: base => ({
      ...base,
      color: colors.onPrimaryDark,
    }),
  };

  const value = { label: selectedLabel, value: selectedValue };

  return (
    <DropdownSelectContainer>
      {label && (
        <DropdownSelectLabel htmlFor={inputId.current} disabled={disabled}>
          {label}
        </DropdownSelectLabel>
      )}
      <Select
        styles={selectStyle}
        inputId={inputId.current}
        maxMenuHeight="9rem"
        menuPlacement="auto"
        menuPortalTarget={document.body}
        isDisabled={disabled}
        isSearchable={false}
        value={value}
        {...props}
      />
    </DropdownSelectContainer>
  );
}

DropdownSelect.propTypes = {
  label: PropTypes.string,
  selectedLabel: PropTypes.string,
  selectedValue: PropTypes.any,
  disabled: PropTypes.bool,
  optionStyle: PropTypes.func,
};

export default memo(DropdownSelect);
