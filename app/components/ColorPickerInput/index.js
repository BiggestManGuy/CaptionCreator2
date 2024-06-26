/**
 *
 * ColorPickerInput
 *
 */

import { uniqueId as uid } from 'lodash';
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import ColorPicker from 'containers/ColorPicker';
import ColorPickerInputLabel from 'components/Input/InputLabel';
import ColorPickerInputContainer from './ColorPickerInputContainer';
import ColorPickerInputSwatch from './ColorPickerInputSwatch';

function ColorPickerInput({
  label,
  value,
  pickerProps = {},
  onChange = () => {},
  onOpen = () => {},
  onSave = () => {},
  onCancel = () => {},
}) {
  const inputId = useRef(uid('color-input_'));
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <ColorPicker
      color={value}
      isOpen={isPickerOpen}
      onChange={onChange}
      onSave={color => {
        setIsPickerOpen(false);
        onSave(color);
      }}
      onCancel={initialColor => {
        setIsPickerOpen(false);
        onCancel(initialColor);
      }}
      {...pickerProps}
    >
      <ColorPickerInputContainer>
        {label && (
          <ColorPickerInputLabel htmlFor={inputId.current}>
            {label}
          </ColorPickerInputLabel>
        )}
        <ColorPickerInputSwatch
          id={inputId.current}
          value={value}
          onClick={() => {
            if (!isPickerOpen) {
              setIsPickerOpen(true);
              onOpen();
            }
          }}
        />
      </ColorPickerInputContainer>
    </ColorPicker>
  );
}

ColorPickerInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  pickerProps: PropTypes.object,
  onChange: PropTypes.func,
  onOpen: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

export default ColorPickerInput;
