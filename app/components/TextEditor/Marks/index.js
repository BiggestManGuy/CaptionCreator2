import React from 'react';
import PropTypes from 'prop-types';

import FontMark from './Font';
import SizeMark from './Size';
import ColorMark from './Color';
import WeightMark from './Weight';
import ItalicMark from './Italic';
import UnderlineMark from './Underline';
import StrokeMark from './Stroke';
import LetterSpacingMark from './LetterSpacing';

const markRenderers = {
  font: FontMark,
  size: SizeMark,
  weight: WeightMark,
  color: ColorMark,
  italic: ItalicMark,
  underline: UnderlineMark,
  stroke: StrokeMark,
  letterSpacing: LetterSpacingMark,
};

function renderMark({ mark, attributes, children }) {
  const value = mark.data.get('value');

  const MarkRenderer = markRenderers[mark.type];
  return (
    <MarkRenderer {...{ [mark.type]: value, ...attributes }}>
      {children}
    </MarkRenderer>
  );
}

renderMark.propTypes = {
  mark: PropTypes.object,
  attributes: PropTypes.object,
  children: PropTypes.node,
};

export default renderMark;
