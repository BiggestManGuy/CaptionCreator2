import React from 'react';
import PropTypes from 'prop-types';

function ColorMark(props) {
  return (
    <span className="m-color" style={{ color: props.color }}>
      {props.children}
    </span>
  );
}

ColorMark.propTypes = {
  color: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default ColorMark;
