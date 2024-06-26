/**
 *
 * ContextMenu
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import Sidebar from 'components/Sidebar';

import ContextMenuCaption from 'containers/ContextMenuCaption';
import ContextMenuImage from 'containers/ContextMenuImage';
import ContextMenuText from 'containers/ContextMenuText';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { makeSelectContext, makeSelectContextData } from './selectors';
import reducer from './reducer';
import saga from './saga';

import {
  MENU_CONTEXT_CAPTION,
  MENU_CONTEXT_IMAGE,
  MENU_CONTEXT_TEXT,
} from './constants';

const Menus = {
  [MENU_CONTEXT_CAPTION]: ContextMenuCaption,
  [MENU_CONTEXT_IMAGE]: ContextMenuImage,
  [MENU_CONTEXT_TEXT]: ContextMenuText,
};

export function ContextMenu({ context, contextData = {}, ...sidebarProps }) {
  useInjectReducer({ key: 'contextMenu', reducer });
  useInjectSaga({ key: 'contextMenu', saga });

  const CurrentContext = Menus[context];

  return (
    <Sidebar {...sidebarProps}>
      <CurrentContext {...contextData} />
    </Sidebar>
  );
}

ContextMenu.propTypes = {
  context: PropTypes.string,
  contextData: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  context: makeSelectContext(),
  contextData: makeSelectContextData(),
});

function mapDispatchToProps(dispatch) {
  return {
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
)(ContextMenu);
