/**
 *
 * Form
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

function Form({ onSubmit = () => {}, children, ...props }) {
  return (
    <form
      onSubmit={evt => {
        evt.preventDefault();
        onSubmit(evt);
        return false;
      }}
      {...props}
    >
      {children}
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func,
  children: PropTypes.node,
};

export default memo(Form);
