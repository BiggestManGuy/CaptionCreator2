/**
 *
 * BoxModelSelect
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Button from 'components/Button';

import {
  iconTargetTopLeft,
  iconTargetTop,
  iconTargetTopRight,
  iconTargetRight,
  iconTargetBottomRight,
  iconTargetBottom,
  iconTargetBottomLeft,
  iconTargetLeft,
  iconTargetMiddle,
} from './icons';
import BoxModelSelectLabel from './BoxModelSelectLabel';

import {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
} from './constants';

export const Container = styled.div`
  display: grid;
  grid:
    [top-start] 'top-left top top-right' 1fr [top-end]
    [middle-start] 'left middle right' 1fr [middle-end]
    [bottom-start] 'bottom-left bottom bottom-right' 1fr [bottom-end]
    / 1fr 1fr 1fr;
  grid-gap: 0.25rem;
  width: 100%;
`;

const Target = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-width: initial;
  padding: 0;

  &::before {
    content: '';
    display: inline-block;
    padding-bottom: 100%;
  }
`;

const TopLeftTarget = styled(Target).attrs({
  icon: iconTargetTopLeft,
})`
  grid-area: top-left;
`;

const TopTarget = styled(Target).attrs({
  icon: iconTargetTop,
})`
  grid-area: top;
`;

const TopRightTarget = styled(Target).attrs({
  icon: iconTargetTopRight,
})`
  grid-area: top-right;
`;

const RightTarget = styled(Target).attrs({
  icon: iconTargetRight,
})`
  grid-area: right;
`;

const BottomRightTarget = styled(Target).attrs({
  icon: iconTargetBottomRight,
})`
  grid-area: bottom-right;
`;

const BottomTarget = styled(Target).attrs({
  icon: iconTargetBottom,
})`
  grid-area: bottom;
`;

const BottomLeftTarget = styled(Target).attrs({
  icon: iconTargetBottomLeft,
})`
  grid-area: bottom-left;
`;

const LeftTarget = styled(Target).attrs({
  icon: iconTargetLeft,
})`
  grid-area: left;
`;

const MiddleTarget = styled(Target).attrs({
  icon: iconTargetMiddle,
})`
  grid-area: middle;
`;

function BoxModelSelect({
  activeTargets = [],
  top = TOP,
  right = RIGHT,
  bottom = BOTTOM,
  left = LEFT,
  topLeft = TOP_LEFT,
  topRight = TOP_RIGHT,
  bottomLeft = BOTTOM_LEFT,
  bottomRight = BOTTOM_RIGHT,
  onTargetSelect = () => {},
}) {
  const isActive = targets =>
    activeTargets.length === targets.length &&
    activeTargets.every(target => targets.includes(target));

  return (
    <Container>
      <TopTarget
        active={isActive([top])}
        onPress={() => onTargetSelect([top], [])}
      />
      <RightTarget
        active={isActive([right])}
        onPress={() => onTargetSelect([right], [])}
      />
      <BottomTarget
        active={isActive([bottom])}
        onPress={() => onTargetSelect([bottom], [])}
      />
      <LeftTarget
        active={isActive([left])}
        onPress={() => onTargetSelect([left], [])}
      />
      <TopLeftTarget
        active={isActive([topLeft])}
        onPress={() => onTargetSelect([], [topLeft])}
      />
      <TopRightTarget
        active={isActive([topRight])}
        onPress={() => onTargetSelect([], [topRight])}
      />
      <BottomRightTarget
        active={isActive([bottomRight])}
        onPress={() => onTargetSelect([], [bottomRight])}
      />
      <BottomLeftTarget
        active={isActive([bottomLeft])}
        onPress={() => onTargetSelect([], [bottomLeft])}
      />
      <MiddleTarget
        active={isActive([
          top,
          right,
          bottom,
          left,
          topLeft,
          topRight,
          bottomLeft,
          bottomRight,
        ])}
        onPress={() =>
          onTargetSelect(
            [top, right, bottom, left],
            [topLeft, topRight, bottomLeft, bottomRight],
          )
        }
      />
    </Container>
  );
}

BoxModelSelect.propTypes = {
  activeTargets: PropTypes.arrayOf(PropTypes.string),
  top: PropTypes.string,
  right: PropTypes.string,
  bottom: PropTypes.string,
  left: PropTypes.string,
  topLeft: PropTypes.string,
  topRight: PropTypes.string,
  bottomLeft: PropTypes.string,
  bottomRight: PropTypes.string,
  onTargetSelect: PropTypes.func,
};

export default memo(BoxModelSelect);
export { BoxModelSelectLabel };
