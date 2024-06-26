import React, { useRef } from 'react';
import { usePrevious, useTimeout } from 'react-use';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import colors from 'styles/colors';

const fadeAway = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Indicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 5rem;
  padding: 1rem;
  font-size: 1rem;
  text-align: center;
  background-color: ${colors.primary};
  border: 1px solid ${colors.primaryExtraDark};
  z-index: 1;
  transform: translateX(-50%) translateY(-50%);
  pointer-events: none;
  animation-name: ${props => (props.hide ? fadeAway : 'none')};
  animation-duration: 0.5s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;

function AdjustableViewZoomIndicator({ zoom = 100, showFor = 1000 }) {
  const renderIndicator = useRef(false);
  const prevZoom = usePrevious(zoom) || zoom;
  const [hideIndicator, , restartHideTimer] = useTimeout(showFor);

  if (zoom !== prevZoom) {
    restartHideTimer();
    // This is to prevent the indicator briefly showing up on first load.
    // Only render the indicator once the zoom changes.
    renderIndicator.current = true;
  }

  if (renderIndicator.current) {
    return <Indicator hide={hideIndicator()}>{zoom}%</Indicator>;
  }

  return null;
}

AdjustableViewZoomIndicator.propTypes = {
  zoom: PropTypes.number,
  showFor: PropTypes.number,
};

export default AdjustableViewZoomIndicator;
