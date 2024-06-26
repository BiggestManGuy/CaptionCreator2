import React from 'react';
import PropTypes from 'prop-types';
import { InputAddon } from 'components/Input';

function AngleInputAddon({ angle = 0 }) {
  return (
    <InputAddon>
      <svg
        style={{
          width: '1.5rem',
          shapeRendering: 'geometricPrecision',
          textRendering: 'geometricPrecision',
          imageRendering: 'optimizeQuality',
          fillRule: 'evenodd',
          clipRule: 'evenodd',
        }}
        version="1.0"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="5%"
          transform={`rotate(${angle - 90} 256 256)`}
          d="M256 15c133,0 241,108 241,241 0,133 -108,241 -241,241 -133,0 -241,-108 -241,-241 0,-133 108,-241 241,-241zm24 234l199 0c-4,-120 -102,-216 -223,-216 -123,0 -223,100 -223,223 0,123 100,223 223,223 121,0 219,-96 223,-216l-199 0c-3,10 -13,18 -24,18 -14,0 -25,-11 -25,-25 0,-14 11,-25 25,-25 11,0 21,8 24,18z"
        />
      </svg>
    </InputAddon>
  );
}

AngleInputAddon.propTypes = {
  angle: PropTypes.number,
};

export default AngleInputAddon;
