import React from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';

const ToolbarItem = styled.div`
  padding: 0.5rem;
  font-size: 0.75rem;
  color: ${colors.onPrimaryDark};
  text-align: center;
`;

function VersionNumber() {
  return <ToolbarItem>v{VERSION}</ToolbarItem>;
}

export default VersionNumber;
