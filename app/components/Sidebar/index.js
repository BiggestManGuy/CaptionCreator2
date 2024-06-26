/**
 *
 * Sidebar
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import SidebarContainer from './SidebarContainer';
import SidebarInstance from './SidebarInstance';
import SidebarTitle from './SidebarTitle';

import { POS_TOP, POS_RIGHT, POS_BOTTOM, POS_LEFT } from './constants';

function Sidebar({
  children,
  isOpen = true,
  position = POS_RIGHT,
  onOpen = () => {},
  onClose = () => {},
  onWidthChange = () => {},
  onHeightChange = () => {},
}) {
  return (
    <SidebarContainer>
      <SidebarInstance
        isOpen={isOpen}
        position={position}
        onOpen={onOpen}
        onClose={onClose}
        onWidthChange={onWidthChange}
        onHeightChange={onHeightChange}
      >
        {children}
      </SidebarInstance>
    </SidebarContainer>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  position: PropTypes.oneOf([POS_TOP, POS_RIGHT, POS_BOTTOM, POS_LEFT]),
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onWidthChange: PropTypes.func,
  onHeightChange: PropTypes.func,
};

export default memo(Sidebar);
export { SidebarTitle };
