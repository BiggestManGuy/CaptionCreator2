/**
 *
 * Toolbar
 *
 */

import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import ToolbarContainer from './ToolbarContainer';
import ToolbarPanelContainer from './ToolbarPanelContainer';
import ToolbarPanel from './ToolbarPanel';
import ToolbarItem from './ToolbarItem';
import ToolbarItemSeparator from './ToolbarItemSeparator';
import ToolbarDropdown from './ToolbarDropdown';

import useActiveItemState from './useActiveItemState';

function Toolbar({ items }) {
  const container = useRef(null);
  const parents = useRef({});
  const [activeItem, setActiveItem] = useActiveItemState();

  return (
    <ToolbarContainer ref={container}>
      <ToolbarPanelContainer>
        <ToolbarPanel>
          {items.map(item => {
            if (React.isValidElement(item)) return item;
            return (
              <ToolbarItem
                key={item.name}
                ref={node => {
                  parents.current[item.name] = node;
                }}
                icon={item.icon}
                text={item.label}
                active={activeItem === item.name}
                onPress={() => {
                  if (item.onSelect) item.onSelect(item);
                }}
                onMouseEnter={() => setActiveItem(item.name)}
                onMouseLeave={() => setActiveItem(null)}
                onTouchStart={() =>
                  setActiveItem(activeItem ? null : item.name, true)
                }
              />
            );
          })}
        </ToolbarPanel>
      </ToolbarPanelContainer>
      {items
        .filter(item => item.subItems && activeItem === item.name)
        .map(item => (
          <ToolbarDropdown
            key={item.name}
            items={item.subItems}
            parent={parents.current[item.name]}
            onClose={immediate => setActiveItem(null, immediate)}
            container={container.current}
            onMouseEnter={() => setActiveItem(item.name)}
          />
        ))}
    </ToolbarContainer>
  );
}

const itemsShape = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  icon: PropTypes.object,
  onSelect: PropTypes.func,
};

const items = PropTypes.oneOfType([
  PropTypes.shape(itemsShape),
  PropTypes.node,
]);

itemsShape.subItems = PropTypes.arrayOf(items);

Toolbar.propTypes = {
  items: PropTypes.arrayOf(items),
};

export { ToolbarItemSeparator };
export default memo(Toolbar);
