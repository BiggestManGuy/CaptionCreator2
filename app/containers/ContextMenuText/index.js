/**
 *
 * ContextMenuText
 *
 */

import { noop } from 'lodash';
import React, { memo, useEffect, useRef, useContext, useCallback } from 'react';
import { useEvent } from 'react-use';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  faBold,
  faUnderline,
  faItalic,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faArrowsAlt,
  faTextHeight,
} from '@fortawesome/free-solid-svg-icons';

import {
  updateEditorState,
  setAutoHeight,
  setSelectionMode,
  setHideSelection,
} from 'containers/CaptionTextEditors/actions';
import {
  updateLayerWidth,
  updateLayerHeight,
} from 'containers/CaptionLayers/actions';
import {
  makeSelectEditorState,
  makeSelectEditorFormat,
  makeSelectEditorHeight,
  makeSelectEditorAutoHeight,
  makeSelectEditorSelectionMode,
} from 'containers/CaptionTextEditors/selectors';
import {
  makeSelectLayerName,
  makeSelectLayerWidth,
  makeSelectLayerHeight,
} from 'containers/CaptionLayers/selectors';

import { SidebarTitle } from 'components/Sidebar';
import Grid, { GridItem, GridSpacer } from 'components/Grid';
import Input, { InputLabel } from 'components/Input';
import DropdownSelect from 'components/DropdownSelect';
import ColorPickerInput from 'components/ColorPickerInput';
import Button from 'components/Button';
import RadioSelect from 'components/RadioSelect';

import {
  LayerActionButtons,
  LayerPosition,
  LayerOrder,
  LayerBackground,
  Formats,
} from 'containers/ContextMenuCommon';
import { EditorContext } from 'containers/CaptionTextEditors';

import {
  SELECTION_MODE_MOVE,
  SELECTION_MODE_TEXT,
} from 'containers/CaptionTextEditors/constants';

import availableFonts from './AvailableFonts';

const REGULAR = '400';
const BOLD = '700';

const fontOpts = availableFonts.map(font => ({ value: font, label: font }));
const alignOpts = [
  { icon: faAlignLeft, value: 'left' },
  { icon: faAlignCenter, value: 'center' },
  { icon: faAlignRight, value: 'right' },
  { icon: faAlignJustify, value: 'justify' },
];

export function ContextMenuText({
  id,
  name,
  width,
  height,
  editorHeight,
  autoHeight,
  selectionMode,
  editorState,
  font,
  fontSize,
  fontColor,
  fontWeight,
  fontItalic,
  fontUnderline,
  textAlign,
  textIndent,
  lineHeight,
  letterSpacing,
  onUpdateEditorState = () => {},
  onSetAutoHeight = () => {},
  onSetSelectionMode = () => {},
  onSetHideSelection = () => {},
  onUpdateWidth = () => {},
  onUpdateHeight = () => {},
}) {
  const { editors } = useContext(EditorContext);
  const editor = editors[id];

  // Shortcut: Use control key to toggle text selection mode.
  // If anything else was pressed while holding the control key, the shortcut
  // will be cancelled.
  const shouldToggleSelectionMode = useRef(true);
  useEvent(
    'keydown',
    useCallback(evt => {
      shouldToggleSelectionMode.current = evt.key === 'Control';
    }, []),
  );
  useEvent(
    'keyup',
    useCallback(
      evt => {
        if (evt.key === 'Control' && shouldToggleSelectionMode.current) {
          onSetSelectionMode(
            selectionMode === SELECTION_MODE_MOVE
              ? SELECTION_MODE_TEXT
              : SELECTION_MODE_MOVE,
          );
        }
      },
      [selectionMode],
    ),
  );

  // Focus relevant editor when this context menu is open.
  // We depend on the editor instance becuase sometimes it may not be
  // available yet (like when a new editor is created).
  useEffect(() => {
    if (editor) {
      editor.focus();
      return () => editor.blur();
    }
    return noop;
  }, [editor]);

  const revertEditorState = useRef(editorState);

  return (
    <>
      <Grid columns={['1fr', 'auto']}>
        <GridItem>
          <SidebarTitle>{name}</SidebarTitle>
        </GridItem>
        <GridItem>
          <LayerActionButtons id={id} />
        </GridItem>
      </Grid>
      <Grid>
        <GridItem>
          <DropdownSelect
            label="Font"
            options={fontOpts}
            selectedLabel={font}
            selectedValue={font}
            isSearchable
            optionStyle={useCallback(opt => ({ fontFamily: opt.value }), [])}
            onChange={useCallback(
              opt => {
                editor.applyInlineFormat('font', opt.value);
              },
              [editor],
            )}
          />
        </GridItem>
      </Grid>
      <Grid columns={['2fr', '1fr', 'auto', 'auto', 'auto']}>
        <GridItem>
          <Input
            label="Size"
            value={fontSize}
            type="number"
            spinnerStep={1}
            min={1}
            align="right"
            addonRight="px"
            onChange={useCallback(
              size => {
                editor.applyInlineFormat('size', size);
              },
              [editor],
            )}
          />
        </GridItem>
        <GridItem>
          <ColorPickerInput
            label="Color"
            value={fontColor}
            onOpen={() => {
              onSetHideSelection(true);
              revertEditorState.current = editorState;
            }}
            onSave={color => {
              onSetHideSelection(false);
              editor.applyInlineFormat('color', color);
            }}
            onCancel={() => {
              onSetHideSelection(false);
              onUpdateEditorState(revertEditorState.current);
              editor.focus();
            }}
            onChange={color => {
              editor.applyInlineFormat('color', color);
            }}
          />
        </GridItem>
        <GridItem align="end">
          <Button
            icon={faBold}
            active={fontWeight === BOLD}
            onPress={() => {
              editor.applyInlineFormat(
                'weight',
                fontWeight === BOLD ? REGULAR : BOLD,
              );
            }}
          />
        </GridItem>
        <GridItem align="end">
          <Button
            icon={faItalic}
            active={fontItalic}
            onPress={() => {
              editor.toggleInlineFormat('italic');
            }}
          />
        </GridItem>
        <GridItem align="end">
          <Button
            icon={faUnderline}
            active={fontUnderline}
            onPress={() => {
              editor.toggleInlineFormat('underline');
            }}
          />
        </GridItem>
      </Grid>
      <Grid>
        <GridItem>
          <InputLabel>Alignment</InputLabel>
          <RadioSelect
            options={alignOpts}
            selected={textAlign}
            onSelect={useCallback(
              align => {
                editor.applyBlockFormat('align', align);
              },
              [editor],
            )}
          />
        </GridItem>
      </Grid>
      <Grid columns={['1fr', '1fr', '1fr']}>
        <GridItem>
          <Input
            label="Text Indent"
            value={textIndent}
            type="number"
            spinnerStep={0.1}
            min={0}
            onChange={useCallback(
              newTextIndent => {
                editor.applyBlockFormat('textIndent', newTextIndent);
              },
              [editor],
            )}
          />
        </GridItem>
        <GridItem>
          <Input
            label="Line Spacing"
            value={lineHeight}
            type="number"
            spinnerStep={0.05}
            min={0}
            onChange={useCallback(
              newLineHeight => {
                editor.applyBlockFormat('lineHeight', newLineHeight);
              },
              [editor],
            )}
          />
        </GridItem>
        <GridItem>
          <Input
            label="Letter Spacing"
            value={letterSpacing === 'normal' ? 0 : letterSpacing}
            type="number"
            spinnerStep={0.05}
            min={0}
            onChange={useCallback(
              newLetterSpacing => {
                editor.applyInlineFormat(
                  'letterSpacing',
                  newLetterSpacing === 0 ? 'normal' : newLetterSpacing,
                );
              },
              [editor],
            )}
          />
        </GridItem>
      </Grid>
      <GridSpacer />
      <Grid columns={['1fr', '1fr', 'auto']}>
        <GridItem>
          <Input
            label="Width"
            value={Math.round(width)}
            type="number"
            align="right"
            min={1}
            spinnerStep={1}
            spinnerSensitivity={5}
            sanitize={Math.floor}
            addonRight="px"
            onChange={onUpdateWidth}
          />
        </GridItem>
        <GridItem>
          <Input
            label={autoHeight ? 'Height [ Auto ]' : 'Height'}
            value={Math.round(height)}
            type="number"
            align="right"
            min={editorHeight}
            spinnerStep={1}
            spinnerSensitivity={5}
            sanitize={Math.floor}
            addonRight="px"
            onChange={useCallback(
              val => {
                if (autoHeight) onSetAutoHeight(false);
                onUpdateHeight(val);
              },
              [autoHeight, onUpdateHeight],
            )}
          />
        </GridItem>
        <GridItem align="end">
          <Button
            active={autoHeight}
            icon={faTextHeight}
            title="Auto-Height"
            onPress={() => {
              onSetAutoHeight(!autoHeight);
              onUpdateHeight(editorHeight);
            }}
          />
        </GridItem>
        <GridItem>
          <LayerPosition id={id} pos="x" />
        </GridItem>
        <GridItem>
          <LayerPosition id={id} pos="y" />
        </GridItem>
        <GridItem align="end">
          <Button
            active={selectionMode === SELECTION_MODE_MOVE}
            icon={faArrowsAlt}
            title="Move Text Box"
            onPress={() => {
              onSetSelectionMode(
                selectionMode === SELECTION_MODE_MOVE
                  ? SELECTION_MODE_TEXT
                  : SELECTION_MODE_MOVE,
              );
            }}
          />
        </GridItem>
      </Grid>
      <Grid>
        <GridItem>
          <LayerOrder id={id} />
        </GridItem>
      </Grid>
      <GridSpacer />
      <LayerBackground id={id} />
      <GridSpacer />
      <Formats id={id} />
    </>
  );
}

ContextMenuText.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  editorHeight: PropTypes.number,
  autoHeight: PropTypes.bool,
  selectionMode: PropTypes.string,
  editorState: PropTypes.object,
  font: PropTypes.string,
  fontSize: PropTypes.number,
  fontColor: PropTypes.string,
  fontWeight: PropTypes.string,
  fontItalic: PropTypes.bool,
  fontUnderline: PropTypes.bool,
  textAlign: PropTypes.string,
  textIndent: PropTypes.number,
  lineHeight: PropTypes.number,
  letterSpacing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onUpdateEditorState: PropTypes.func,
  onSetAutoHeight: PropTypes.func,
  onSetSelectionMode: PropTypes.func,
  onSetHideSelection: PropTypes.func,
  onUpdateWidth: PropTypes.func,
  onUpdateHeight: PropTypes.func,
  // dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch, { id }) {
  return {
    onUpdateEditorState: state => dispatch(updateEditorState(id, state)),
    onSetAutoHeight: autoHeight => dispatch(setAutoHeight(id, autoHeight)),
    onSetSelectionMode: mode => dispatch(setSelectionMode(id, mode)),
    onSetHideSelection: hide => dispatch(setHideSelection(id, hide)),
    onUpdateWidth: width => dispatch(updateLayerWidth(id, width)),
    onUpdateHeight: height => dispatch(updateLayerHeight(id, height)),
    dispatch,
  };
}

const makeMapStateToProps = () => {
  const selectLayerName = makeSelectLayerName();
  const selectLayerWidth = makeSelectLayerWidth();
  const selectLayerHeight = makeSelectLayerHeight();
  const selectEditorHeight = makeSelectEditorHeight();
  const selectEditorAutoHeight = makeSelectEditorAutoHeight();
  const selectEditorSelectionMode = makeSelectEditorSelectionMode();
  const selectEditorState = makeSelectEditorState();
  const selectFont = makeSelectEditorFormat('font');
  const selectFontSize = makeSelectEditorFormat('size');
  const selectFontColor = makeSelectEditorFormat('color');
  const selectFontWeight = makeSelectEditorFormat('weight');
  const selectFontItalic = makeSelectEditorFormat('italic');
  const selectFontUnderline = makeSelectEditorFormat('underline');
  const selectTextAlign = makeSelectEditorFormat('align');
  const selectTextIndent = makeSelectEditorFormat('textIndent');
  const selectLineHeight = makeSelectEditorFormat('lineHeight');
  const selectLetterSpacing = makeSelectEditorFormat('letterSpacing');

  return (state, { id }) => ({
    name: selectLayerName(state, { id }),
    width: selectLayerWidth(state, { id }),
    height: selectLayerHeight(state, { id }),
    editorHeight: selectEditorHeight(state, { id }),
    autoHeight: selectEditorAutoHeight(state, { id }),
    selectionMode: selectEditorSelectionMode(state, { id }),
    editorState: selectEditorState(state, { id }),
    font: selectFont(state, { id }),
    fontSize: selectFontSize(state, { id }),
    fontColor: selectFontColor(state, { id }),
    fontWeight: selectFontWeight(state, { id }),
    fontItalic: selectFontItalic(state, { id }),
    fontUnderline: selectFontUnderline(state, { id }),
    textAlign: selectTextAlign(state, { id }),
    textIndent: selectTextIndent(state, { id }),
    lineHeight: selectLineHeight(state, { id }),
    letterSpacing: selectLetterSpacing(state, { id }),
  });
};

const withConnect = connect(
  makeMapStateToProps(),
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ContextMenuText);
