import _clamp from 'lodash/clamp';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Checkerboard from 'components/Checkerboard';
import ColorPicker from 'containers/ColorPicker';

export const MarkerContainer = styled.div.attrs(props => ({
  style: {
    left: `${props.position}%`,
  },
}))`
  position: absolute;
  padding: 0 5px;
  transform: translateX(-50%);
  user-select: none;
`;

export const Marker = styled(Checkerboard)`
  position: relative;
  width: 1rem;
  height: 1rem;
  background-color: ${props => props.color};
  border: 1px solid white;
  box-shadow: inset 0px 0px 0px 1px black, 0 0 0 1px black;

  &::before,
  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }

  &::before {
    top: calc(-1rem - 2px);
    left: -2px;
    border-width: calc(0.5rem + 1px);
    border-color: transparent transparent black transparent;
  }

  &::after {
    top: -1rem;
    left: -1px;
    border-width: 0.5rem;
    border-color: transparent transparent white transparent;
  }
`;

class GradientControlMarker extends React.PureComponent {
  /**
   * Calculates percentage position (0 - 100) of a marker relative
   * to it's container.
   */
  static calcPosition(xPos, xOffset, containerWidth, origPos = 0) {
    // Find how far the user moved their mouse horizontally.
    const deltaX = xPos - xOffset;
    // Convert that to our percentage position.
    const deltaPos = Math.floor((deltaX / containerWidth) * 100);
    // Add that to the orignal position (what it was before moving it)
    // to find the new position.
    return _clamp(origPos + deltaPos, 0, 100);
  }

  constructor(props) {
    super(props);

    this.xOffset = null;
    this.origPos = props.position;
    this.hasMoved = false;
    this.containerWidth = null;

    this.state = {
      pickerOpen: false,
    };
  }

  componentWillUnmount() {
    this.detachGlobalListeners();
  }

  attachGlobalListeners = () => {
    document.addEventListener('mousemove', this.onMarkerMove);
    document.addEventListener('touchmove', this.onMarkerMove);
    document.addEventListener('mouseup', this.onMarkerRelease);
    document.addEventListener('touchend', this.onMarkerRelease);
  };

  detachGlobalListeners = () => {
    document.removeEventListener('mousemove', this.onMarkerMove);
    document.removeEventListener('touchmove', this.onMarkerMove);
    document.removeEventListener('mouseup', this.onMarkerRelease);
    document.removeEventListener('touchend', this.onMarkerRelease);
  };

  onMarkerHold = evt => {
    evt.preventDefault();
    this.hasMoved = false;

    const { position, container } = this.props;
    const { clientX } = evt.changedTouches ? evt.changedTouches[0] : evt;
    this.xOffset = clientX;
    this.origPos = position;
    // We need the container width to find the percentage based position (0 - 100).
    // Instead of querying the DOM every mousemove, we cache it here.
    this.containerWidth = container.current.offsetWidth;
    this.attachGlobalListeners();
  };

  onMarkerMove = evt => {
    const { index, color, position, onUpdate } = this.props;
    const { clientX } = evt.changedTouches ? evt.changedTouches[0] : evt;
    const newPos = GradientControlMarker.calcPosition(
      clientX,
      this.xOffset,
      this.containerWidth,
      this.origPos,
    );

    if (newPos !== position) {
      this.hasMoved = true;
      onUpdate(index, { color, position: newPos });
    }
  };

  onMarkerRelease = ({ button }) => {
    this.detachGlobalListeners();

    // Right mouse click.
    if (!this.hasMoved && button === 2) {
      this.onMarkerRemove();
    }
  };

  onMarkerRemove = () => {
    const { index, canRemove, onRemove } = this.props;
    if (canRemove) onRemove(index);
  };

  onMarkerClick = () => {
    // If the user hasn't moved the marker, then it's considered a click.
    if (!this.hasMoved) {
      this.setState({ pickerOpen: true });
    }
  };

  onPickerSave = () => {
    this.setState({ pickerOpen: false });
  };

  onPickerCancel = initialColor => {
    this.setState({ pickerOpen: false });
    this.onColorUpdate(initialColor);
  };

  onColorUpdate = color => {
    const { index, position, onUpdate } = this.props;
    onUpdate(index, { color, position });
  };

  render() {
    const { color, position, allowTransparency } = this.props;
    const { pickerOpen } = this.state;
    return (
      <ColorPicker
        color={color}
        isOpen={pickerOpen}
        onSave={this.onPickerSave}
        onCancel={this.onPickerCancel}
        onChange={this.onColorUpdate}
        lockOpacity={!allowTransparency}
      >
        <MarkerContainer
          position={position}
          onClick={this.onMarkerClick}
          onDoubleClick={this.onMarkerRemove}
          onTouchStart={this.onMarkerHold}
          onMouseDown={this.onMarkerHold}
        >
          <Marker color={color} />
        </MarkerContainer>
      </ColorPicker>
    );
  }
}

GradientControlMarker.propTypes = {
  index: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  canRemove: PropTypes.bool.isRequired,
  allowTransparency: PropTypes.bool,
  container: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default GradientControlMarker;
