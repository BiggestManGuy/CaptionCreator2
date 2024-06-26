import React from 'react';
import PropTypes from 'prop-types';

function StrokeMark(props) {
  const { active, color } = props.stroke;
  const textShadow = active
    ? `-1px -1px 0 ${color}, 0 -1px 0 ${color}, 1px -1px 0 ${color}, 1px 0 0 ${color}, 1px 1px 0 ${color}, 0 1px 0 ${color}, -1px 1px 0 ${color}, -1px 0 0 ${color}`
    : 'none';

  return (
    <span className="m-stroke" style={{ textShadow }}>
      {props.children}
    </span>
  );
}

StrokeMark.propTypes = {
  stroke: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

export default StrokeMark;
