import React from 'react';
import PropTypes from 'prop-types';

function FontMark({ font, children }) {
  const hasSpaces = /\s/.test(font);
  return (
    <span
      className="m-font"
      style={{
        fontFamily: hasSpaces ? `"${font}"` : font,
      }}
    >
      {children}
    </span>
  );
}

FontMark.propTypes = {
  font: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default FontMark;
