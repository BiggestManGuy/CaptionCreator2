/**
 *
 * GradientControl
 *
 */

import _sortBy from 'lodash/sortBy';
import React from 'react';
import PropTypes from 'prop-types';

import GradientControlContainer from './GradientControlContainer';
import GradientControlBar from './GradientControlBar';
import GradientControlMarkerContainer from './GradientControlMarkerContainer';

class GradientControl extends React.PureComponent {
  static toGradientString({ markers, angle = 90 }) {
    const orderedMarkers = _sortBy(markers, 'position');
    const colorStops = orderedMarkers.map(
      marker => `${marker.color} ${marker.position}%`,
    );

    return `linear-gradient(${angle}deg, ${colorStops.join(', ')})`;
  }

  render() {
    const { markers, allowTransparency, onMarkerUpdate } = this.props;
    return (
      <GradientControlContainer>
        <GradientControlBar
          gradient={GradientControl.toGradientString({ markers })}
        />
        <GradientControlMarkerContainer
          markers={markers}
          allowTransparency={allowTransparency}
          onUpdate={onMarkerUpdate}
        />
      </GradientControlContainer>
    );
  }
}

GradientControl.propTypes = {
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      color: PropTypes.string,
      position: PropTypes.number,
    }),
  ),
  allowTransparency: PropTypes.bool,
  onMarkerUpdate: PropTypes.func,
};

GradientControl.defaultProps = {
  markers: [
    { id: 'gradient_marker_def1', color: '#ffffff', position: 0 },
    { id: 'gradient_marker_def2', color: '#ffffff', position: 100 },
  ],
  allowTransparency: true,
};

export default GradientControl;
