import { isNumber } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

function LetterSpacingMark({ letterSpacing, children }) {
  return (
    <span
      className="m-spacing"
      style={{
        letterSpacing: isNumber(letterSpacing)
          ? `${letterSpacing}em`
          : letterSpacing,
      }}
    >
      {children}
    </span>
  );
}

LetterSpacingMark.propTypes = {
  letterSpacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  children: PropTypes.node,
};

export default LetterSpacingMark;
