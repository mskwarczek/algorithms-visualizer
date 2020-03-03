import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import HomePage from './HomePage/HomePage';
import SortContainer from './SortModule/SortContainer';

const Router = () => {
  
  return (
    <div className='appContainer'>
      <div className='navigationContainer'>
        <Link to='/'>Algorithms Visualizer</Link>
        <Link to='/sort'>Sort</Link>
      </div>
      <Switch >
        <Route exact path='/' component={HomePage} />
        <Route exact path='/sort' component={SortContainer} />
      </Switch>
    </div>
  );
};

export default Router;
