/**
 *
 * Property
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import PropertyLabel from './PropertyLabel';
import PropertyValue from './PropertyValue';

function Property({ label, withInput = false, children }) {
  return (
    <>
      <PropertyLabel>{label}</PropertyLabel>
      <PropertyValue withInput={withInput}>{children}</PropertyValue>
    </>
  );
}

Property.propTypes = {
  label: PropTypes.string.isRequired,
  withInput: PropTypes.bool,
  children: PropTypes.node,
};

export default memo(Property);
