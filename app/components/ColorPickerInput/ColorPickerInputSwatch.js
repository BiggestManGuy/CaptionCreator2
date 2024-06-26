import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from 'styles/colors';

import Button from 'components/Button/ButtonContainer';
import Checkerboard from 'components/Checkerboard';

const SwatchContainer = styled(Button)`
  width: 100%;
  padding: 0.5rem;
`;

const Swatch = styled(Checkerboard)`
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background: ${props => props.value};
  border-radius: 3px;
  border: 1px solid ${colors.primaryDark};
`;

const NoColor = styled.div`
  border-top: 1px solid ${colors.onPrimary};
`;

const ColorPickerInputSwatch = React.forwardRef(({ value, ...props }, ref) => (
  <SwatchContainer ref={ref} {...props}>
    {(() => {
      if (value) return <Swatch value={value} />;
      return <NoColor />;
    })()}
  </SwatchContainer>
));

ColorPickerInputSwatch.propTypes = {
  value: PropTypes.string,
};

export default ColorPickerInputSwatch;
