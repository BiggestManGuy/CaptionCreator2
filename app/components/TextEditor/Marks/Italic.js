import React from 'react';
import PropTypes from 'prop-types';

function ItalicMark(props) {
  return <span className="m-italic">{props.children}</span>;
}

ItalicMark.propTypes = {
  children: PropTypes.node,
};

export default ItalicMark;
