import { createGlobalStyle } from 'styled-components';
import colors from './colors';

/* eslint no-unused-expressions: 0 */
const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    overflow: hidden;
    overscroll-behavior: none;
  }

  body {
    font-family: 'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif;
    color: ${colors.onPrimary};
  }

  #app {
    height: 100%;
    width: 100%;
  }

  button, label {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  /* ---Third Party Components--- */
  .sketch-picker {
    input {
      color: black;
    }
    input:focus {
      outline: none;
    }
  }
`;

export default GlobalStyle;
