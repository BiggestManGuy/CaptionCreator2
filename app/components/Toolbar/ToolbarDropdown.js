import React, { useRef, useState, useCallback } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import colors from 'styles/colors';
import ToolbarDropdownContainer from './ToolbarDropdownContainer';
import ToolbarItem from './ToolbarItem';

import useActiveItemState from './useActiveItemState';

export function resolveDropdownPos({
  anchor,
  target,
  pos = ['bottom'],
  xOffset = 0,
  yOffset = 0,
}) {
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const anchorBounds = anchor.getBoundingClientRect();
  const targetBounds = target.getBoundingClientRect();

  let candidate;
  for (let i = 0; i < pos.length; i += 1) {
    const cPos = pos[i];
    const isVertical = cPos === 'top' || cPos === 'bottom';

    let x;
    let y;
    switch (cPos) {
      case 'top':
        x = anchorBounds.left + xOffset;
        y = anchorBounds.top - targetBounds.height - yOffset;
        break;
      case 'right':
        x = anchorBounds.right + xOffset;
        y = anchorBounds.top + yOffset;
        break;
      case 'bottom':
        x = anchorBounds.left + xOffset;
        y = anchorBounds.bottom + yOffset;
        break;
      case 'left':
        x = anchorBounds.left - targetBounds.width - xOffset;
        y = anchorBounds.top + yOffset;
        break;
      default:
        x = 0;
        y = 0;
    }

    candidate = { x, y, pos: cPos };

    // Adjust cross coordinates to fit window.
    if (isVertical) {
      candidate.x = x - Math.max(x + targetBounds.width - winW, 0);
    } else {
      candidate.y = y - Math.max(y + targetBounds.height - winH, 0);
    }

    const coord = isVertical ? y : x;
    const extend = targetBounds[isVertical ? 'width' : 'height'];
    const win = isVertical ? winH : winW;

    if (coord > 0 && coord + extend < win) {
      return candidate;
    }
  }

  return candidate;
}

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 15rem;
  background: ${colors.primary};
  border: 1px solid ${colors.primaryExtraDark};

  animation: 0.25s ${slideIn} ease;

  ${ToolbarItem} {
    height: 2rem;
  }
`;

function ToolbarDropdown({
  items,
  parent,
  pos = ['bottom'],
  container = document.body,
  xOffset = 0,
  yOffset = 0,
  onClose = () => {},
  ...props
}) {
  const parents = useRef({});
  const [resolvedPos, setResolvedPos] = useState({});

  // 250ms refers to the animation duration of the dropdown.
  // This ensures the animation is complete before opening another sub item.
  const [activeItem, setActiveItem] = useActiveItemState(undefined, 250);

  const resolvePos = useCallback(dropdown => {
    if (dropdown) {
      setResolvedPos(
        resolveDropdownPos({
          anchor: parent,
          target: dropdown,
          pos,
          xOffset,
          yOffset,
        }),
      );
    }
  }, []);

  return ReactDom.createPortal(
    <ToolbarDropdownContainer
      ref={resolvePos}
      x={resolvedPos.x}
      y={resolvedPos.y}
      onMouseLeave={() => onClose(false)}
      {...props}
    >
      <Dropdown>
        {items.map(item => {
          if (React.isValidElement(item)) return item;
          return (
            <ToolbarItem
              key={item.name}
              ref={node => {
                parents.current[item.name] = node;
              }}
              icon={item.icon}
              iconAlt={item.subItems && faCaretRight}
              iconAltProps={{ fixedWidth: false }}
              text={item.label}
              onPress={() => {
                if (item.onSelect) {
                  item.onSelect(item);
                  onClose(true);
                }
              }}
              onMouseEnter={() => setActiveItem(item.name)}
              onMouseLeave={() => setActiveItem(null)}
              onTouchStart={() =>
                setActiveItem(activeItem ? null : item.name, true)
              }
            />
          );
        })}
        {items
          .filter(item => item.subItems && activeItem === item.name)
          .map(item => (
            <ToolbarDropdown
              key={item.name}
              items={item.subItems}
              pos={['right', 'left', 'bottom']}
              parent={parents.current[item.name]}
              container={container}
              xOffset={-1}
              yOffset={-1}
              onClose={immediate => {
                setActiveItem(null, immediate);
                if (immediate) onClose(true);
              }}
              onMouseEnter={() => setActiveItem(item.name)}
            />
          ))}
      </Dropdown>
    </ToolbarDropdownContainer>,
    container,
  );
}

ToolbarDropdown.propTypes = {
  items: PropTypes.array.isRequired,
  pos: PropTypes.arrayOf(PropTypes.string),
  parent: PropTypes.instanceOf(Element),
  container: PropTypes.instanceOf(Element),
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

export default ToolbarDropdown;
