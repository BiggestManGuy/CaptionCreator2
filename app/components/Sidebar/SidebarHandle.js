import styled, { css } from 'styled-components';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import colors from 'styles/colors';
import Button, { ButtonIcon } from 'components/Button';

import { POS_TOP, POS_RIGHT, POS_BOTTOM, POS_LEFT } from './constants';

const calcRight = css`
  ${props => (props.position !== POS_RIGHT ? '0' : '')}
`;

const calcBottom = css`
  ${props => (props.position === POS_TOP ? '0' : '')}
`;

const calcTranslateX = css`
  ${props => {
    switch (props.position) {
      case POS_RIGHT:
        return '-100%';
      case POS_LEFT:
        return '100%';
      default:
        return '0';
    }
  }}
`;

const calcTranslateY = css`
  ${props => {
    switch (props.position) {
      case POS_TOP:
        return '100%';
      case POS_BOTTOM:
        return '-100%';
      default:
        return '0';
    }
  }}
`;

const calcRotation = css`
  ${props => {
    switch (props.position) {
      case POS_TOP:
        return props.isOpen ? '90deg' : '270deg';
      case POS_RIGHT:
        return props.isOpen ? '180deg' : '0';
      case POS_BOTTOM:
        return props.isOpen ? '270deg' : '90deg';
      case POS_LEFT:
        return props.isOpen ? '0' : '180deg';
      default:
        return '0';
    }
  }}
`;

const calcBorderWidth = pos => css`
  ${props => (props.position === pos ? '0' : '1px')}
`;

const bw = calcBorderWidth;

export default styled(Button).attrs({
  icon: faChevronLeft,
})`
  position: absolute;
  right: ${calcRight};
  bottom: ${calcBottom};
  width: 2rem;
  padding: 0;
  background-color: ${colors.primary};
  border: 1px solid ${colors.primaryExtraDark};
  border-top-width: ${bw(POS_TOP)};
  border-right-width: ${bw(POS_RIGHT)};
  border-bottom-width: ${bw(POS_BOTTOM)};
  border-left-width: ${bw(POS_LEFT)};
  border-radius: 0;
  z-index: 1;
  transform: translateX(${calcTranslateX}) translateY(${calcTranslateY});

  ${ButtonIcon} {
    transform: rotate(${calcRotation});
    transition: transform 0.25s;
  }
`;
