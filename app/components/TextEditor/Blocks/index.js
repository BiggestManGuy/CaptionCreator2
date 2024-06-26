import React from 'react';
import PropTypes from 'prop-types';
import ParagraphBlock from './Paragraph';

function renderNode({ node, ...props }) {
  const formats = node.data.get('formats');

  switch (node.type) {
    case 'paragraph':
      return <ParagraphBlock formats={formats} {...props} />;
    default:
      return null;
  }
}

renderNode.propTypes = {
  node: PropTypes.object,
};

export default renderNode;
