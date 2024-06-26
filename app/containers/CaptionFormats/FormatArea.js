import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  getMargin,
  getPadding,
  getBorderColor,
  getBorderWidth,
  getBorderRadius,
} from './selectors';

import {
  S_TOP,
  S_RIGHT,
  S_BOTTOM,
  S_LEFT,
  C_TOP_LEFT,
  C_TOP_RIGHT,
  C_BOTTOM_LEFT,
  C_BOTTOM_RIGHT,
} from './constants';

const toCSSBox = (formats, getter) =>
  [S_TOP, S_RIGHT, S_BOTTOM, S_LEFT]
    .map(side => `${getter(formats, side)}px`)
    .join(' ');

const toCSSBorder = (formats, side) =>
  `${getBorderWidth(formats, side)}px solid ${getBorderColor(formats, side)}`;

const FormatRegions = styled.div`
  display: ${props => (props.showRegions ? 'block' : 'none')};
  position: absolute;
  width: 100%;
  height: 100%;
  border: solid green;
`;

const FormatRegionsMargin = styled(FormatRegions).attrs(({ formats }) => ({
  style: {
    margin: toCSSBox(
      formats,
      (f, s) => -(getBorderWidth(f, s) + getMargin(f, s)),
    ),
    padding: toCSSBox(formats, getBorderWidth),
    borderWidth: toCSSBox(formats, getMargin),
  },
}))`
  box-sizing: content-box;
`;

const FormatRegionsPadding = styled(FormatRegions).attrs(({ formats }) => ({
  style: {
    margin: toCSSBox(formats, (f, s) => -getPadding(f, s)),
    borderWidth: toCSSBox(formats, getPadding),
  },
}))``;

const Container = styled.div.attrs(({ formats }) => ({
  style: {
    margin: toCSSBox(formats, getMargin),
    padding: toCSSBox(formats, getPadding),
    borderTop: toCSSBorder(formats, S_TOP),
    borderRight: toCSSBorder(formats, S_RIGHT),
    borderBottom: toCSSBorder(formats, S_BOTTOM),
    borderLeft: toCSSBorder(formats, S_LEFT),
    borderTopLeftRadius: getBorderRadius(formats, C_TOP_LEFT),
    borderTopRightRadius: getBorderRadius(formats, C_TOP_RIGHT),
    borderBottomLeftRadius: getBorderRadius(formats, C_BOTTOM_LEFT),
    borderBottomRightRadius: getBorderRadius(formats, C_BOTTOM_RIGHT),
  },
}))`
  display: block;
  position: relative;
`;

const FormatArea = React.forwardRef(
  ({ children, formats, showRegions, ...props }, ref) => (
    <Container ref={ref} formats={formats} {...props}>
      <FormatRegionsMargin
        data-exclude-render
        formats={formats}
        showRegions={showRegions}
      />
      <FormatRegionsPadding
        data-exclude-render
        formats={formats}
        showRegions={showRegions}
      />
      {children}
    </Container>
  ),
);

FormatArea.propTypes = {
  children: PropTypes.node,
  formats: PropTypes.object,
  showRegions: PropTypes.bool,
};

export default FormatArea;
