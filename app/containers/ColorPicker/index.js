/**
 *
 * ColorPicker
 *
 */

/* eslint-disable no-underscore-dangle */

import React, { memo, useEffect, useRef } from 'react';
import useEvent from 'react-use/lib/useEvent';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Pickr from '@simonwep/pickr';

import { CaptionPersistStorage } from 'containers/CaptionPersistController';

import colors from 'styles/colors';

import { useInjectPersistedReducer } from 'utils/injectPersistedReducer';
import { addUsedColor } from './actions';
import { makeSelectUsedColors } from './selectors';
import reducer from './reducer';

import '@simonwep/pickr/dist/themes/nano.min.css';

const PickrStyle = createGlobalStyle`
  .pcr-app.app-theme[data-theme="nano"] {
    background: ${colors.primary};
    border: 1px solid ${colors.primaryExtraDark};
    border-radius: 0;

    button.pcr-active {
      box-shadow: 0 0 0 2px white;
    }

    .pcr-swatches {
      & > button {
        border: 1px solid ${colors.primaryDark};
      }
    }

    .pcr-selection {
      .pcr-picker {
        border: 2px solid white;
        box-shadow: 0 0 0 1px ${colors.primaryDark};
      }
      .pcr-color-palette {
        .pcr-palette {
          border-radius: 0;

          &::before {
            background-size: 0.5rem;
            background-position: center;
          }
        }
      }
      .pcr-color-preview {
        .pcr-current-color {
          border: 1px solid ${colors.primaryDark};
        }
      }
    }

    .pcr-interaction {
      input:focus {
        box-shadow: none;
      }

      .pcr-result {
        background: ${colors.primaryLight};
        color: ${colors.onPrimary};

        &::selection {
          background: ${colors.secondary};
        }
      }

      .pcr-save {
        background: ${colors.secondary};
        color: ${colors.onSecondary};
      }
      .pcr-cancel {
        background: ${colors.danger};
        color: ${colors.onDanger};
      }
    }
  }
`;

function ColorPicker({
  children,
  color,
  isOpen = false,
  swatches = [],
  colorRepresentation = 'HEX',
  onChange = () => {},
  onCancel = () => {},
  onSave = () => {},
  ...pickrProps
}) {
  const childEl = useRef();
  const pickr = useRef();
  const initialColor = useRef(color); // The color to revert to if user cancels.

  useInjectPersistedReducer({
    key: 'colorPicker',
    storage: CaptionPersistStorage,
    reducer,
  });

  // On mount.
  useEffect(() => {
    pickr.current = Pickr.create({
      el: childEl.current,
      theme: 'nano',
      appClass: 'app-theme',
      useAsButton: true,
      padding: 12,
      lockOpacity: false,
      default: color,
      defaultRepresentation: colorRepresentation,
      // showAlways blocks all automatic opening and closing.
      // We want open/close to be controlled through props.
      showAlways: true,
      components: {
        palette: true,
        preview: true,
        hue: true,
        opacity: true,
        interaction: {
          input: true,
          cancel: true,
          save: true,
        },
      },
      ...pickrProps,
    });

    pickr.current
      .on('init', () => pickr.current.hide()) // Hide it, Quickly! Before they see!
      .on('save', _color => onSave(_color.toHEXA().toString()));

    return () => {
      if (pickr.current) {
        pickr.current.destroyAndRemove();
        pickr.current = null;
      }
    };
  }, []);

  const handleBlur = evt => {
    if (
      isOpen &&
      !Pickr.utils
        .eventPath(evt)
        .some(
          el =>
            el === pickr.current._root.app || el === pickr.current._root.button,
        )
    ) {
      onCancel(initialColor.current);
    }
  };

  useEvent('mousedown', handleBlur);
  useEvent('touchstart', handleBlur);

  // Set color when prop changes.
  useEffect(() => {
    // Pickr has a proper API for parsing colors but doesn't expose it :/
    const { values: hsva } = pickr.current._parseLocalColor(color || 'white');

    // HACK:
    // Pickr ignores Saturation amount when color Value is 0. This prevents the
    // the palette selection jerking to the bottom left.
    if (
      hsva &&
      !(hsva[2] === 0 && pickr.current.getColor().toHSVA()[2] === 0)
    ) {
      pickr.current.setHSVA(...hsva, true);
      pickr.current.setColorRepresentation(colorRepresentation);
    }
  }, [color]);

  // Control open/close through props.
  useEffect(() => {
    if (isOpen) {
      pickr.current.show();
      initialColor.current = color;
    } else {
      pickr.current.hide();
    }
  }, [isOpen]);

  // Refresh color swatches when prop changes.
  useEffect(() => {
    swatches.forEach(swatch => pickr.current.addSwatch(swatch));

    return () => {
      if (pickr.current) {
        swatches.forEach(() => pickr.current.removeSwatch(0));
      }
    };
  }, [swatches]);

  useEffect(() => {
    const onChangeHandler = () =>
      onChange(
        // TODO: Match the returned color with colorRepresentation.
        pickr.current
          .getColor()
          .toHEXA()
          .toString(),
      );

    pickr.current
      .on('swatchselect', onChangeHandler)
      .on('changestop', onChangeHandler);
    return () => {
      if (pickr.current) {
        pickr.current
          .off('swatchselect', onChangeHandler)
          .off('changestop', onChangeHandler);
      }
    };
  }, [onChange]);

  useEffect(() => {
    const onCancelHandler = () => onCancel(initialColor.current);

    pickr.current.on('cancel', onCancelHandler);
    return () => {
      if (pickr.current) {
        pickr.current.off('cancel', onCancelHandler);
      }
    };
  }, [onCancel]);

  return (
    <>
      <PickrStyle />
      {React.cloneElement(React.Children.only(children), { ref: childEl })}
    </>
  );
}

ColorPicker.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  isOpen: PropTypes.bool,
  swatches: PropTypes.arrayOf(PropTypes.string),
  colorRepresentation: PropTypes.string,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  swatches: makeSelectUsedColors(),
});

function mapDispatchToProps(dispatch, { onSave = () => {} }) {
  return {
    onSave: color => {
      dispatch(addUsedColor(color));
      onSave(color);
    },
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ColorPicker);
