import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  position: relative;
`;

export const File = styled.input.attrs({
  type: 'file',
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: pointer;
`;

function FileInputNativeWrapper({ children, ...props }) {
  return (
    <Container>
      <File {...props} />
      {children}
    </Container>
  );
}

FileInputNativeWrapper.propTypes = {
  children: PropTypes.node,
};

export default FileInputNativeWrapper;
