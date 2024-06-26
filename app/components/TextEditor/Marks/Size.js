import React from 'react';
import PropTypes from 'prop-types';

function SizeMark(props) {
  return (
    <span className="m-size" style={{ fontSize: props.size }}>
      {props.children}
    </span>
  );
}

SizeMark.propTypes = {
  size: PropTypes.number.isRequired,
  children: PropTypes.node,
};

export default SizeMark;
