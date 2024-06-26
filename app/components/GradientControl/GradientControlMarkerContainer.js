import _uid from 'lodash/uniqueId';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import GradientControlMarker from './GradientControlMarker';

const Container = styled.div`
  position: relative;
  height: 1rem;
`;

class GradientControlMarkerContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.container = React.createRef();
  }

  preventContextMenu = evt => {
    evt.preventDefault();
    return false;
  };

  onMarkerAdd = evt => {
    // Make sure we clicked on an empty space in the container
    // and not an actual marker.
    if (evt.target !== evt.currentTarget) return;

    const id = _uid('gradient-marker_');
    const { markers, onUpdate } = this.props;
    const container = this.container.current;
    const xOffset = container.getBoundingClientRect().left;
    const containerWidth = container.offsetWidth;
    const position = GradientControlMarker.calcPosition(
      evt.clientX,
      xOffset,
      containerWidth,
    );
    // Get last used marker as the initial color for this marker.
    const [{ color }] = markers.slice(-1);

    onUpdate([...markers, { id, color, position }]);
  };

  onMarkerUpdate = (index, marker) => {
    const { markers, onUpdate } = this.props;
    onUpdate([
      ...markers.slice(0, index),
      { id: markers[index].id, ...marker },
      ...markers.slice(index + 1),
    ]);
  };

  onMarkerRemove = index => {
    const { markers, onUpdate } = this.props;
    onUpdate([...markers.slice(0, index), ...markers.slice(index + 1)]);
  };

  render() {
    const { markers, allowTransparency } = this.props;
    return (
      <Container
        ref={this.container}
        onContextMenu={this.preventContextMenu}
        onClick={this.onMarkerAdd}
      >
        {markers.map((marker, index) => (
          <GradientControlMarker
            key={marker.id}
            index={index}
            color={marker.color}
            position={marker.position}
            canRemove={markers.length > 2}
            allowTransparency={allowTransparency}
            container={this.container}
            onUpdate={this.onMarkerUpdate}
            onRemove={this.onMarkerRemove}
          />
        ))}
      </Container>
    );
  }
}

GradientControlMarkerContainer.propTypes = {
  markers: PropTypes.array.isRequired,
  allowTransparency: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
};

export default GradientControlMarkerContainer;
