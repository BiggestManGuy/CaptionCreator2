import React from 'react';
import PropTypes from 'prop-types';
import { InputLabel } from '../Input';

import {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
} from './constants';

function BoxModelSelectLabel({
  targets,
  top = TOP,
  right = RIGHT,
  bottom = BOTTOM,
  left = LEFT,
  topLeft = TOP_LEFT,
  topRight = TOP_RIGHT,
  bottomLeft = BOTTOM_LEFT,
  bottomRight = BOTTOM_RIGHT,
}) {
  const labels = {
    [top]: 'Top',
    [right]: 'Right',
    [bottom]: 'Bottom',
    [left]: 'Left',
    [topLeft]: 'Top-Left',
    [topRight]: 'Top-Right',
    [bottomLeft]: 'Bottom-Left',
    [bottomRight]: 'Bottom-Right',
  };

  return (
    <InputLabel>
      {targets.length === 8
        ? 'All Sides'
        : targets.map(target => labels[target]).join(' ')}
    </InputLabel>
  );
}

BoxModelSelectLabel.propTypes = {
  targets: PropTypes.arrayOf(PropTypes.string),
  top: PropTypes.string,
  right: PropTypes.string,
  bottom: PropTypes.string,
  left: PropTypes.string,
  topLeft: PropTypes.string,
  topRight: PropTypes.string,
  bottomLeft: PropTypes.string,
  bottomRight: PropTypes.string,
};

export default BoxModelSelectLabel;
