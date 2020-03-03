import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './index.scss';
import Navigation from './Navigation'

const App = () => {
  return (
    <BrowserRouter>
        <Navigation />
    </BrowserRouter>
  );
};

export default App;
