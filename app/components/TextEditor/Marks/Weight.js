import React from 'react';
import PropTypes from 'prop-types';

function WeightMark(props) {
  return (
    <span className="m-weight" style={{ fontWeight: props.weight }}>
      {props.children}
    </span>
  );
}

WeightMark.propTypes = {
  weight: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default WeightMark;
