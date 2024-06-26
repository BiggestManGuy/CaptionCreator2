import { omit } from 'lodash';
import React, { memo, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { faHighlighter, faBan } from '@fortawesome/free-solid-svg-icons';

import { setShowRegions, applyFormat } from 'containers/CaptionFormats/actions';
import {
  makeSelectShowRegions,
  makeSelectFormat,
  getCommonFormat,
  getPadding,
  getBorderColor,
  getBorderWidth,
  getBorderRadius,
} from 'containers/CaptionFormats/selectors';

import Grid, { GridItem } from 'components/Grid';
import Button from 'components/Button';
import BoxModelSelect, { BoxModelSelectLabel } from 'components/BoxModelSelect';
import Input from 'components/Input';
import ColorPickerInput from 'components/ColorPickerInput';

import {
  S_TOP,
  S_RIGHT,
  S_BOTTOM,
  S_LEFT,
  C_TOP_LEFT,
  C_TOP_RIGHT,
  C_BOTTOM_LEFT,
  C_BOTTOM_RIGHT,
  F_PADDING,
  F_BORDER_COLOR,
  F_BORDER_WIDTH,
  F_BORDER_RADIUS,
} from '../CaptionFormats/constants';

export function Formats({
  disablePadding = false,
  showRegions,
  formats,
  onShowRegionChange = () => {},
  onApplyFormat = () => {},
}) {
  const [appliedSides, setAppliedSides] = useState([
    S_TOP,
    S_RIGHT,
    S_BOTTOM,
    S_LEFT,
  ]);
  const [appliedCorners, setAppliedCorners] = useState([
    C_TOP_LEFT,
    C_TOP_RIGHT,
    C_BOTTOM_LEFT,
    C_BOTTOM_RIGHT,
  ]);

  const appliedTargets = [...appliedSides, ...appliedCorners];

  const appliedPadding = getCommonFormat(formats, appliedSides, getPadding);
  const appliedBorderColor = getCommonFormat(
    formats,
    appliedSides,
    getBorderColor,
  );
  const appliedBorderWidth = getCommonFormat(
    formats,
    appliedSides,
    getBorderWidth,
  );
  const appliedBorderRadius = getCommonFormat(
    formats,
    appliedCorners,
    getBorderRadius,
  );

  const hasRegions = !disablePadding;

  const applyFormatToTargets = (formatTarget, targets) => {
    onApplyFormat({
      ...formats,
      ...targets.reduce(
        (format, target) => ({
          ...format,
          [target]: { ...formats[target], ...formatTarget },
        }),
        {},
      ),
    });
  };

  // Used when cancelling a potential border color.
  const revertFormat = useRef(formats);

  return (
    <>
      {hasRegions && (
        <Grid columns={['1fr', 'auto', 'auto']}>
          <GridItem colStart="2">
            <Button
              small
              icon={faHighlighter}
              active={showRegions}
              title="Show Regions"
              onPress={() => {
                onShowRegionChange(!showRegions);
              }}
            />
          </GridItem>
          <GridItem>
            <Button
              small
              danger
              icon={faBan}
              title="Clear Format"
              onPress={() => {
                onApplyFormat(omit(formats, appliedTargets));
              }}
            />
          </GridItem>
        </Grid>
      )}
      <Grid columns={['1fr', '1fr', '1fr']} rows={['auto', 'auto']}>
        <GridItem column>
          <BoxModelSelectLabel
            targets={appliedTargets}
            top={S_TOP}
            right={S_RIGHT}
            bottom={S_BOTTOM}
            left={S_LEFT}
            topLeft={C_TOP_LEFT}
            topRight={C_TOP_RIGHT}
            bottomLeft={C_BOTTOM_LEFT}
            bottomRight={C_BOTTOM_RIGHT}
          />
          <BoxModelSelect
            activeTargets={appliedTargets}
            top={S_TOP}
            right={S_RIGHT}
            bottom={S_BOTTOM}
            left={S_LEFT}
            topLeft={C_TOP_LEFT}
            topRight={C_TOP_RIGHT}
            bottomLeft={C_BOTTOM_LEFT}
            bottomRight={C_BOTTOM_RIGHT}
            onTargetSelect={useCallback((sides, corners) => {
              setAppliedSides(sides);
              setAppliedCorners(corners);
            }, [])}
          />
        </GridItem>
        {!!appliedSides.length && (
          <GridItem>
            <Input
              label="Padding"
              value={appliedPadding}
              type="number"
              align="right"
              min={0}
              spinnerStep={5}
              spinnerSensitivity={20}
              placeholder={appliedPadding ? '' : '—'}
              addonRight="px"
              onChange={padding =>
                applyFormatToTargets({ [F_PADDING]: padding }, appliedSides)
              }
            />
          </GridItem>
        )}
        {!!appliedCorners.length && (
          <GridItem colStart="3">
            <Input
              label="Corner Radius"
              value={appliedBorderRadius}
              type="number"
              align="right"
              min={0}
              spinnerStep={1}
              spinnerSensitivity={10}
              placeholder={appliedBorderRadius ? '' : '—'}
              addonRight="px"
              onChange={radius =>
                applyFormatToTargets(
                  { [F_BORDER_RADIUS]: radius },
                  appliedCorners,
                )
              }
            />
          </GridItem>
        )}
        {!!appliedSides.length && (
          <>
            <GridItem rowStart="2" align="end">
              <ColorPickerInput
                label="Border Color"
                value={appliedBorderColor}
                // No transparency on borders for now ;_;
                // Due to a hack on HTML2Canvas where the border is rendered 3
                // times to fix corner tearing.
                pickerProps={{
                  lockOpacity: true,
                }}
                onOpen={() => {
                  revertFormat.current = formats;
                }}
                onCancel={() => onApplyFormat(revertFormat.current)}
                onChange={color =>
                  applyFormatToTargets(
                    {
                      [F_BORDER_COLOR]: color,
                    },
                    appliedSides,
                  )
                }
              />
            </GridItem>
            <GridItem rowStart="2" align="end">
              <Input
                label="Border Width"
                value={appliedBorderWidth}
                type="number"
                align="right"
                min={0}
                spinnerStep={1}
                spinnerSensitivity={10}
                placeholder={appliedBorderWidth ? '' : '—'}
                addonRight="px"
                onChange={width =>
                  applyFormatToTargets(
                    { [F_BORDER_WIDTH]: width },
                    appliedSides,
                  )
                }
              />
            </GridItem>
          </>
        )}
      </Grid>
    </>
  );
}

Formats.propTypes = {
  disablePadding: PropTypes.bool,
  showRegions: PropTypes.bool,
  formats: PropTypes.object,
  onShowRegionChange: PropTypes.func.isRequired,
  onApplyFormat: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const selectShowRegions = makeSelectShowRegions();
  const selectFormats = makeSelectFormat();

  return (state, props) => ({
    showRegions: selectShowRegions(state, props),
    formats: selectFormats(state, props),
  });
};

function mapDispatchToProps(dispatch, { id, onApplyFormat }) {
  return {
    onShowRegionChange: showRegions =>
      dispatch(setShowRegions(id, showRegions)),
    onApplyFormat: format => {
      if (onApplyFormat) {
        onApplyFormat(format);
      } else {
        dispatch(applyFormat(id, format));
      }
    },
    dispatch,
  };
}

const withConnect = connect(
  makeMapStateToProps(),
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Formats);
