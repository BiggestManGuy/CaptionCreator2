/* eslint-disable indent */

import styled from 'styled-components';
import filterStyledProps from 'utils/filterStyledProps';
import { Editor } from 'slate-react';

import defaultFormats from './defaultFormats';

export default styled(Editor).withConfig(
  filterStyledProps(['hideSelection'], true),
)`
  line-height: ${defaultFormats.lineHeight};
  font-family: ${defaultFormats.font};
  font-size: ${defaultFormats.size}px;
  font-weight: ${defaultFormats.weight};
  text-align: ${defaultFormats.align};
  color: ${defaultFormats.color};
  cursor: text;

  p {
    margin: 0;
    padding: 0;
  }

  .m-underline span[data-slate-string] {
    text-decoration: underline;
  }

  .m-italic {
    font-style: italic;
  }

  & *::selection {
    color: ${props => (props.hideSelection ? 'inherit' : '')};
    background: ${props => (props.hideSelection ? 'transparent' : '')};
  }
`;
