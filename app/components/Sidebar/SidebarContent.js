import React, { useRef } from 'react';
import useEvent from 'react-use/lib/useEvent';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import colors from 'styles/colors';

const Container = styled.div`
  height: 100%;
  margin: 0;
  padding: 0.5rem;
  border: ${colors.primaryExtraDark} 1px solid;
  background-color: ${colors.primary};
  overflow: auto;
`;

const Wrapper = styled.div`
  position: relative;
  max-width: 320px;
  margin: auto;
`;

function SidebarContent({ children, scrollPadding = 6 }) {
  const containerEl = useRef();
  const focusedChild = useRef();

  const onChildFocused = evt => {
    focusedChild.current = evt.target;
  };

  const onChildBlur = () => {
    focusedChild.current = null;
  };

  // Ensure input target is in view when soft keyboard appears.
  useEvent('resize', () => {
    if (focusedChild.current) {
      focusedChild.current.scrollIntoView(false);
      containerEl.current.scrollTop += scrollPadding;
    }
  });

  return (
    <Container ref={containerEl} onFocus={onChildFocused} onBlur={onChildBlur}>
      <Wrapper>{children}</Wrapper>
    </Container>
  );
}

SidebarContent.propTypes = {
  children: PropTypes.node,
  scrollPadding: PropTypes.number,
};

export default SidebarContent;
