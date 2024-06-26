/**
 *
 * Modal
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { createGlobalStyle } from 'styled-components';

import colors from 'styles/colors';

import ModalTitle from './ModalTitle';

ReactModal.setAppElement('#app');

const ModalStyle = createGlobalStyle`
  .ReactModal__Overlay__AppTheme {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.75);
    opacity: 0;
    z-index: 999;
    transition: opacity 0.25s linear;
  }

  .ReactModal__Overlay__AppTheme.ReactModal__Overlay--after-open {
    opacity: 1;
  }

  .ReactModal__Overlay__AppTheme.ReactModal__Overlay--before-close {
    opacity: 0;
  }

  .ReactModal__Content__AppTheme {
    flex: 1;
    margin: 1rem;
    max-width: 420px;
    padding: 0.5rem;
    background: ${colors.primary};
    border: 1px solid ${colors.primaryExtraDark};
    overflow: auto;
    outline: none;
    transition: margin 0.5s;
  }

  .ReactModal__Content__AppTheme.ReactModal__Content--after-open {
    margin-top: 6rem;
  }

  .ReactModal__Content__AppTheme.ReactModal__Content--before-close {
    margin-top: 0;
  }
`;

function Modal({ title, ...props }) {
  return (
    <>
      <ModalStyle />
      <ReactModal
        overlayClassName="ReactModal__Overlay__AppTheme"
        className="ReactModal__Content__AppTheme"
        closeTimeoutMS={250}
        contentLabel={title}
        {...props}
      >
        {title && <ModalTitle>{title}</ModalTitle>}
        {props.children}
      </ReactModal>
    </>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default memo(Modal);
