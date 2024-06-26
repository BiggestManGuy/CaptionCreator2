/**
 *
 * App.js
 * ------
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route, Redirect } from 'react-router-dom';

import CaptionCreator from 'containers/CaptionCreator/Loadable';

import GlobalStyle from 'styles/global-styles';

export default function App() {
  return (
    <>
      <Helmet>
        <title>Caption Creator</title>
        <meta
          name="description"
          content="Easily compose text and images with a variety of formatting options."
        />
      </Helmet>
      <Switch>
        <Route exact path="/" component={CaptionCreator} />
        <Redirect to="/" />
      </Switch>
      <GlobalStyle />
    </>
  );
}
