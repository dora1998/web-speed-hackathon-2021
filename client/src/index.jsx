import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import './webfont.css';
import { AppContainer } from './containers/AppContainer';

window.addEventListener('load', () => {
  ReactDOM.render(
    <BrowserRouter>
      <AppContainer />
    </BrowserRouter>,
    document.getElementById('app'),
  );
});
