/**
 *
 * Input
 *
 */

import {
  uniqueId as uid,
  flow,
  clamp,
  identity,
  round,
  debounce,
} from 'lodash';
import React, { memo, useEffect, useState, useRef, useCallback } from 'react';
import { useEvent } from 'react-use';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import InputContainer from './InputContainer';
import InputLabel from './InputLabel';
import InputControlContainer from './InputControlContainer';
import InputControlAddon from './InputControlAddon';
import InputControl from './InputControl';

const InputControlAddonSpinner = styled(InputControlAddon)`
  cursor: ${props => (props.disabled ? null : 'ns-resize')};
`;

const coerceInputValue = (origVal, type) => val => {
  if (type === 'number') {
    if (val || val === 0) return Number(val);
    // Browsers return falsy if input type = number and the input value
    // is not a valid floating point.
    return origVal;
  }
  return String(val);
};

const clampInputValue = (origVal, type, min, max) => val => {
  if (type === 'number') return clamp(val, min, max);
  if (val.length < min) return origVal;
  if (val.length > max) return val.substring(0, max);
  return val;
};

function Input({
  className,
  label,
  value = '',
  optional = false,
  disabled = false,
  type = 'text',
  align = 'left',
  min = -Infinity,
  max = Infinity,
  spinnerStep = 10,
  spinnerSensitivity = 10,
  sanitize = identity,
  debounceMS = 1000,
  addonLeft = null,
  addonRight = null,
  htmlInput = {},
  onChange = () => {},
  ...inputProps
}) {
  const inputEl = useRef(null);
  const inputId = useRef(uid('input-'));
  const shouldPreventNativeFocus = useRef(true);
  const spinnerIsDragging = useRef(false);
  const spinnerYAnchor = useRef(false);
  const spinnerAnchorValue = useRef(value);
  const spinnerLastValue = useRef(value);

  const [inputValue, setInputValue] = useState(value);

  const sanitizeInput = useCallback(
    raw =>
      flow(
        coerceInputValue(value, type),
        clampInputValue(value, type, min, max),
        val => sanitize(val, value),
      )(raw),
    [sanitize],
  );

  const debounceInputChange = useCallback(
    debounce(
      (newValue, valueProp, optionalProp, sanitizer, onChangeHandler) => {
        if (optionalProp && newValue === '') {
          onChangeHandler(null);
          return;
        }

        const sanitizedValue = sanitizer(newValue);

        if (valueProp !== sanitizedValue) {
          // The value has changed from the parent prop.
          onChangeHandler(sanitizedValue);
        } else if (newValue !== sanitizedValue) {
          // The value is still the same,
          // but the displayed input value has diverged from the santised value.
          setInputValue(sanitizedValue);
        }
      },
      debounceMS,
    ),
    [debounceMS],
  );

  useEffect(() => {
    // Update our value with the parent's.
    // Since we debounce the input, we have to maintain an internal state.
    debounceInputChange.cancel(); // Cancel any pending change.
    setInputValue(value);
  }, [value]);

  const onBeginSpinner = evt => {
    // Prevent text selection while dragging.
    evt.preventDefault();

    if (!disabled) {
      const { clientY } = evt.changedTouches ? evt.changedTouches[0] : evt;
      spinnerYAnchor.current = clientY;
      spinnerAnchorValue.current = Number(inputValue || 0);
      spinnerIsDragging.current = true;
    }
  };

  const onSpinnerDrag = useCallback(
    evt => {
      if (spinnerIsDragging.current) {
        evt.preventDefault();

        const { clientY } = evt.changedTouches ? evt.changedTouches[0] : evt;
        const delta = spinnerYAnchor.current - clientY;
        const direction = Math.floor(delta / spinnerSensitivity);
        // Precision = number of decimal places in step.
        // We need to use this to round the final value for floating point errors.
        const precision = Math.max(String(spinnerStep).length - 2, 0);
        const spinnerValue = round(
          spinnerAnchorValue.current + spinnerStep * direction,
          precision,
        );
        if (spinnerValue !== spinnerLastValue.current) {
          spinnerLastValue.current = spinnerValue;
          const sanitizedValue = sanitizeInput(spinnerValue);
          if (sanitizedValue !== value) {
            onChange(sanitizedValue);
          }
        }
      }
    },
    [spinnerSensitivity, spinnerStep, sanitizeInput, onChange],
  );

  const onEndSpinner = useCallback(() => {
    spinnerIsDragging.current = false;
  }, []);

  useEvent('mousemove', onSpinnerDrag);
  useEvent('touchmove', onSpinnerDrag);
  useEvent('mouseup', onEndSpinner);
  useEvent('touchend', onEndSpinner);

  const hasSpinner = type === 'number';

  const addonProps = {
    disabled,
    onClick() {
      if (inputEl.current) {
        inputEl.current.focus();
        shouldPreventNativeFocus.current = false;
      }
    },
  };

  const renderInputAddon = addon => {
    if (React.isValidElement(addon)) {
      return React.cloneElement(addon, addonProps);
    }
    if (addon) {
      return <InputControlAddon {...addonProps}>{addon}</InputControlAddon>;
    }
    return null;
  };

  return (
    <InputContainer
      className={className}
      hasSpinner={hasSpinner}
      onTouchStart={evt => {
        if (inputEl.current === document.activeElement) {
          onBeginSpinner(evt);
        }
      }}
    >
      {label && (
        <InputLabel disabled={disabled} htmlFor={inputId.current}>
          {label}
        </InputLabel>
      )}
      <InputControlContainer>
        {hasSpinner && !addonLeft && (
          <InputControlAddonSpinner
            disabled={disabled}
            icon={faSort}
            onMouseDown={onBeginSpinner}
          />
        )}
        {renderInputAddon(addonLeft)}
        <InputControl
          {...htmlInput}
          ref={inputEl}
          id={label && inputId.current}
          value={inputValue !== null ? String(inputValue) : ''}
          type={type}
          align={align}
          disabled={disabled}
          onChange={evt => {
            setInputValue(evt.target.value);
            debounceInputChange(
              evt.target.value,
              value,
              optional,
              sanitizeInput,
              onChange,
            );
          }}
          onFocus={evt => evt.target.select()}
          onBlur={() => {
            shouldPreventNativeFocus.current = true;
          }}
          onMouseDown={evt => {
            // onFocus selects the whole input.
            // This prevents immediate deselection upon clicking input.
            // However, we do NOT want to prevent user from the usual behaviour
            // afterwards.
            if (shouldPreventNativeFocus.current) {
              evt.preventDefault();
              evt.target.focus();

              shouldPreventNativeFocus.current = false;
            }
          }}
          {...inputProps}
        />
        {renderInputAddon(addonRight)}
      </InputControlContainer>
    </InputContainer>
  );
}

Input.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  optional: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  align: PropTypes.oneOf(['left', 'right']),
  min: PropTypes.number,
  max: PropTypes.number,
  spinnerStep: PropTypes.number,
  spinnerSensitivity: PropTypes.number,
  sanitize: PropTypes.func,
  debounceMS: PropTypes.number,
  addonLeft: PropTypes.node,
  addonRight: PropTypes.node,
  htmlInput: PropTypes.object,
  onChange: PropTypes.func,
};

export default memo(Input);
export { InputControlAddon as InputAddon, InputLabel };
