import { isFinite } from 'lodash';
import React, { useEffect } from 'react';
import useSize from 'react-use/lib/useSize';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import SidebarContent from './SidebarContent';
import SidebarHandle from './SidebarHandle';

import { POS_TOP, POS_RIGHT, POS_BOTTOM, POS_LEFT } from './constants';
import { isVertical } from './utils';

const calcPos = pos => props => (props.position === pos ? '0' : '');

const calcTranslateX = css`
  ${props => {
    switch (props.position) {
      case POS_RIGHT:
        return props.isOpen ? '0' : '100%';
      case POS_LEFT:
        return props.isOpen ? '0' : '-100%';
      default:
        return '0';
    }
  }}
`;

const calcTranslateY = css`
  ${props => {
    switch (props.position) {
      case POS_TOP:
        return props.isOpen ? '0' : '-100%';
      case POS_BOTTOM:
        return props.isOpen ? '0' : '100%';
      default:
        return '0';
    }
  }}
`;

const calcWidth = css`
  ${props => (isVertical(props.position) ? '100%' : '320px')}
`;

const calcMaxHeight = css`
  ${props => (isVertical(props.position) ? '40%' : '100%')}
`;

// NOTE: &[style] is to override useSize setting relative positioning.
const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: ${calcPos(POS_TOP)};
  right: ${calcPos(POS_RIGHT)};
  bottom: ${calcPos(POS_BOTTOM)};
  left: ${calcPos(POS_LEFT)};
  width: ${calcWidth};
  max-height: ${calcMaxHeight};
  transform: translateX(${calcTranslateX}) translateY(${calcTranslateY});
  transition: transform 0.5s;
  pointer-events: auto;

  &[style] {
    position: absolute !important;
  }
`;

function SidebarInstance({
  children,
  isOpen = true,
  position = POS_RIGHT,
  onOpen = () => {},
  onClose = () => {},
  onWidthChange = () => {},
  onHeightChange = () => {},
}) {
  const [sidebar, { width, height }] = useSize(() => (
    <Container isOpen={isOpen} position={position}>
      <SidebarHandle
        isOpen={isOpen}
        position={position}
        onPress={() => {
          if (isOpen) onClose();
          else onOpen();
        }}
      />
      <SidebarContent>{children}</SidebarContent>
    </Container>
  ));

  useEffect(() => {
    if (isFinite(width)) onWidthChange(width);
  }, [width]);

  useEffect(() => {
    if (isFinite(height)) onHeightChange(height);
  }, [height]);

  return sidebar;
}

SidebarInstance.propTypes = {
  isOpen: PropTypes.bool,
  position: PropTypes.oneOf([POS_TOP, POS_RIGHT, POS_BOTTOM, POS_LEFT]),
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

export default SidebarInstance;
