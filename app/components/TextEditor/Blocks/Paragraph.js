import React from 'react';
import PropTypes from 'prop-types';

function ParagraphBlock(props) {
  const { formats } = props;
  const styles = {};

  Object.keys(formats).forEach(format => {
    const value = formats[format];
    switch (format) {
      case 'align':
        styles.textAlign = value;
        if (value === 'justify') styles.whiteSpace = 'pre-line';
        break;
      case 'textIndent':
        styles.textIndent = `${value}em`;
        break;
      default:
        styles[format] = value;
    }
  });

  return (
    <p style={styles} {...props.attributes}>
      {props.children}
    </p>
  );
}

ParagraphBlock.propTypes = {
  formats: PropTypes.object,
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node,
};

ParagraphBlock.defaultProps = {
  formats: {},
};

export default ParagraphBlock;
