/**
 *
 * BackgroundInput
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import Grid, { GridItem } from 'components/Grid';
import Input, { InputLabel } from 'components/Input';
import RadioSelect from 'components/RadioSelect';
import ColorPickerInput from 'components/ColorPickerInput';
import GradientControl from 'components/GradientControl';

import AngleInputAddon from './AngleInputAddon';

export const BG_TYPE_NONE = 'BG_NONE';
export const BG_TYPE_SOLID = 'BG_SOLID';
export const BG_TYPE_GRADIENT = 'BG_GRADIENT';

export const DEFAULT_TYPE = BG_TYPE_SOLID;
export const DEFAULT_COLOR = '#ffffff';
export const DEFAULT_GRADIENT = {
  angle: 180,
  markers: GradientControl.defaultProps.markers,
};

export function toBackground({ type, color, gradient }) {
  switch (type) {
    case BG_TYPE_SOLID:
      return color;
    case BG_TYPE_GRADIENT:
      return GradientControl.toGradientString(gradient);
    default:
      return null;
  }
}

function BackgroundInput({
  value = {
    type: DEFAULT_TYPE,
    color: DEFAULT_COLOR,
    gradient: DEFAULT_GRADIENT,
  },
  allowedTypes = [BG_TYPE_NONE, BG_TYPE_SOLID, BG_TYPE_GRADIENT],
  allowTransparency = true,
  onUpdate = () => {},
}) {
  const types = [
    {
      label: 'None',
      value: BG_TYPE_NONE,
    },
    {
      label: 'Solid',
      value: BG_TYPE_SOLID,
    },
    {
      label: 'Gradient',
      value: BG_TYPE_GRADIENT,
    },
  ].filter(opt => allowedTypes.includes(opt.value));

  return (
    <>
      <Grid columns={['1fr', '1fr', '1fr']}>
        <GridItem colStart="1" colEnd="3">
          <InputLabel>Background</InputLabel>
          <RadioSelect
            options={types}
            selected={value.type}
            onSelect={type => onUpdate({ ...value, type })}
          />
        </GridItem>
        {value.type === BG_TYPE_SOLID && (
          <GridItem>
            <ColorPickerInput
              label="Color"
              value={value.color}
              onCancel={color => onUpdate({ ...value, color })}
              onChange={color => onUpdate({ ...value, color })}
              pickerProps={{ lockOpacity: !allowTransparency }}
            />
          </GridItem>
        )}
        {value.type === BG_TYPE_GRADIENT && (
          <GridItem>
            <Input
              label="Angle"
              value={value.gradient.angle}
              type="number"
              min={0}
              max={360}
              spinnerStep={45}
              spinnerSensitivity={20}
              sanitize={Math.floor}
              addonRight={<AngleInputAddon angle={value.gradient.angle} />}
              onChange={angle =>
                onUpdate({ ...value, gradient: { ...value.gradient, angle } })
              }
            />
          </GridItem>
        )}
      </Grid>
      {value.type === BG_TYPE_GRADIENT && (
        <Grid>
          <GridItem>
            <GradientControl
              markers={value.gradient.markers}
              allowTransparency={allowTransparency}
              onMarkerUpdate={markers =>
                onUpdate({ ...value, gradient: { ...value.gradient, markers } })
              }
            />
          </GridItem>
        </Grid>
      )}
    </>
  );
}

BackgroundInput.propTypes = {
  value: PropTypes.shape({
    type: PropTypes.oneOf([BG_TYPE_NONE, BG_TYPE_SOLID, BG_TYPE_GRADIENT]),
    color: PropTypes.string,
    gradient: PropTypes.shape({
      angle: PropTypes.number,
      markers: PropTypes.array,
    }),
  }),
  allowedTypes: PropTypes.array,
  allowTransparency: PropTypes.bool,
  onUpdate: PropTypes.func,
};

export default memo(BackgroundInput);
