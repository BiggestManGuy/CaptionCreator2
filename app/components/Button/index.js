/**
 *
 * Button
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import ButtonContainer from './ButtonContainer';
import ButtonIcon from './ButtonIcon';
import ButtonText from './ButtonText';
import ButtonGroup from './ButtonGroup';

const Button = React.forwardRef(
  (
    {
      onPress,
      text,
      type = 'button',
      icon,
      iconProps = {},
      iconAlt,
      iconAltProps = {},
      ...buttonProps
    },
    ref,
  ) => (
    <ButtonContainer ref={ref} onClick={onPress} type={type} {...buttonProps}>
      {icon && <ButtonIcon icon={icon} {...iconProps} />}
      {text && <ButtonText>{text}</ButtonText>}
      {iconAlt && <ButtonIcon icon={iconAlt} fixedWidth {...iconAltProps} />}
    </ButtonContainer>
  ),
);

Button.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.object,
  iconProps: PropTypes.object,
  iconAlt: PropTypes.object,
  iconAltProps: PropTypes.object,
  active: PropTypes.bool,
  primary: PropTypes.bool,
  danger: PropTypes.bool,
  pullLeft: PropTypes.bool,
  pullRight: PropTypes.bool,
  small: PropTypes.bool,
  onPress: PropTypes.func,
};

export default Button;
export { ButtonIcon, ButtonText, ButtonGroup };
