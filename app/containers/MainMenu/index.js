/**
 *
 * MainMenu
 *
 */

import { isEmpty } from 'lodash';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  faFileImage,
  faFile,
  faSave,
  faFileUpload,
  faPlus,
  faImages,
  faImage,
  faTools,
  faQuestionCircle,
  faBug,
} from '@fortawesome/free-solid-svg-icons';
import { faText } from 'styles/icons';

import { changeContext } from 'containers/ContextMenu/actions';
import { openDialog } from 'containers/Dialog/actions';
import { makeSelectLayerNames } from 'containers/CaptionLayers/selectors';
import { makeSelectImageIDs } from 'containers/CaptionImages/selectors';
import { makeSelectEditorIDs } from 'containers/CaptionTextEditors/selectors';

import Toolbar, { ToolbarItemSeparator } from 'components/Toolbar';

import {
  MENU_CONTEXT_CAPTION,
  MENU_CONTEXT_IMAGE,
  MENU_CONTEXT_TEXT,
} from 'containers/ContextMenu/constants';

import {
  NEW_CAPTION_DIALOG,
  SAVE_CAPTION_DIALOG,
  LOAD_CAPTION_DIALOG,
  EXPORT_CAPTION_DIALOG,
  NEW_IMAGE_DIALOG,
  NEW_TEXT_EDITOR_DIALOG,
} from 'containers/Dialog/constants';

import VersionNumber from './VersionNumber';

export function MainMenu({
  layerNames = {},
  imageIDs = [],
  editorIDs = [],
  onChangeContext = () => {},
  onOpenDialog = () => {},
}) {
  return (
    <Toolbar
      items={[
        {
          name: 'caption',
          label: 'Caption',
          icon: faFileImage,
          subItems: [
            {
              name: 'properties',
              label: 'Properties',
              icon: faTools,
              onSelect: () => onChangeContext(MENU_CONTEXT_CAPTION),
            },
            <ToolbarItemSeparator horizontal key="seperator" />,
            {
              name: 'new',
              label: 'Create New',
              icon: faFile,
              onSelect: () => onOpenDialog(NEW_CAPTION_DIALOG),
            },
            {
              name: 'save',
              label: 'Save As',
              icon: faSave,
              onSelect: () => onOpenDialog(SAVE_CAPTION_DIALOG),
            },
            {
              name: 'load',
              label: 'Load',
              icon: faFileUpload,
              onSelect: () => onOpenDialog(LOAD_CAPTION_DIALOG),
            },
            {
              name: 'export',
              label: 'Export As Image',
              icon: faImage,
              onSelect: () => onOpenDialog(EXPORT_CAPTION_DIALOG),
            },
          ],
        },
        {
          name: 'images',
          label: 'Images',
          icon: faImages,
          subItems: [
            ...imageIDs.map(id => ({
              name: id,
              label: layerNames[id],
              icon: faImage,
              onSelect() {
                onChangeContext(MENU_CONTEXT_IMAGE, { id });
              },
            })),
            <ToolbarItemSeparator
              key="seperator"
              showOnlyWhen={!isEmpty(imageIDs)}
              horizontal
            />,
            {
              name: 'image-add',
              label: 'New Image',
              icon: faPlus,
              onSelect: () => onOpenDialog(NEW_IMAGE_DIALOG),
            },
          ],
        },
        {
          name: 'text',
          label: 'Text',
          icon: faText,
          subItems: [
            ...editorIDs.map(id => ({
              name: id,
              label: layerNames[id],
              icon: faText,
              onSelect() {
                onChangeContext(MENU_CONTEXT_TEXT, { id });
              },
            })),
            <ToolbarItemSeparator
              key="seperator"
              showOnlyWhen={!isEmpty(editorIDs)}
              horizontal
            />,
            {
              name: 'editor-add',
              label: 'New Text Region',
              icon: faPlus,
              onSelect: () => onOpenDialog(NEW_TEXT_EDITOR_DIALOG),
            },
          ],
        },
        <ToolbarItemSeparator vertical key="seperator" />,
        {
          name: 'about',
          label: 'About',
          icon: faQuestionCircle,
          subItems: [
            <VersionNumber key="version" />,
            {
              name: 'issues',
              label: 'Report Issue',
              icon: faBug,
              onSelect() {
                window.open(
                  `https://docs.google.com/forms/d/e/1FAIpQLSc3JsjPEo5eW7PWATLujPOauFBAzBIRJh_CoOQ_e9OyM1DWYg/viewform?usp=pp_url&entry.1112558324=${VERSION}`,
                );
              },
            },
          ],
        },
      ]}
    />
  );
}

MainMenu.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  layerNames: PropTypes.object,
  imageIDs: PropTypes.arrayOf(PropTypes.string),
  editorIDs: PropTypes.arrayOf(PropTypes.string),
  onChangeContext: PropTypes.func,
  onOpenDialog: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  layerNames: makeSelectLayerNames(),
  imageIDs: makeSelectImageIDs(),
  editorIDs: makeSelectEditorIDs(),
});

function mapDispatchToProps(dispatch) {
  return {
    onChangeContext: (context, data) => dispatch(changeContext(context, data)),
    onOpenDialog: dialog => dispatch(openDialog(dialog)),
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
)(MainMenu);
