import React from 'react';
import PropTypes from 'prop-types';

function UnderlineMark(props) {
  return <span className="m-underline">{props.children}</span>;
}

UnderlineMark.propTypes = {
  children: PropTypes.node,
};

export default UnderlineMark;
