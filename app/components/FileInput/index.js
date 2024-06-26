/**
 *
 * FileInput
 *
 */

import { uniqueId as uid } from 'lodash';
import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';

import { InputLabel } from 'components/Input';
import Container from './FileInputContainer';
import NativeWrapper from './FileInputNativeWrapper';
import Button from './FileInputButton';
import Filename from './FileInputFilename';

function FileInput({ file, label, accept, onSelect = () => {} }) {
  const inputId = useRef(uid('file-input-'));
  const fileName = file ? file.name : undefined;

  return (
    <Container>
      {label && <InputLabel htmlFor={inputId.current}>{label}</InputLabel>}
      <NativeWrapper
        id={inputId.current}
        title={fileName}
        accept={accept}
        onChange={evt => onSelect(evt.target.files[0])}
      >
        <Filename
          value={fileName}
          addonLeft={<Button text="Browse" tabIndex="-1" />}
          tabIndex="-1"
        />
      </NativeWrapper>
    </Container>
  );
}

FileInput.propTypes = {
  file: PropTypes.instanceOf(File),
  label: PropTypes.string,
  accept: PropTypes.string,
  onSelect: PropTypes.func,
};

export default memo(FileInput);
