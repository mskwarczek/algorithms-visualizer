import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './common/index.scss';
import Navigation from './common/Navigation'

const App = () => {
  return (
    <BrowserRouter>
        <Navigation />
    </BrowserRouter>
  );
};

export default App;
