/**
 *
 * Checkerboard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import Overlay from './CheckerboardOverlay';
import Background from './CheckerboardBackground';

function Checkerboard({ children, ...props }) {
  return (
    <Overlay {...props}>
      <Background />
      {children}
    </Overlay>
  );
}

Checkerboard.propTypes = {
  children: PropTypes.node,
};

export default Checkerboard;
