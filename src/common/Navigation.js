import React from 'react';
import { Switch, Route, Link, useLocation } from 'react-router-dom';

import HomePage from '../HomePage/HomePage';
import SortContainer from '../SortModule/SortContainer';
import PathfindingContainer from '../PathfindingModule/PathfindingContainer';

const Router = () => {

  const location = useLocation();
  
  return (
    <div className='appContainer'>
      <div className='navigationContainer'>
        <Link
          to='/'
          className={location.pathname === '/' ? 'active' : undefined}>
          Algorithms Visualizer
        </Link>
        <Link
          to='/sort'
          className={location.pathname === '/sort' ? 'active' : undefined}>
          Sorting Algorithms
        </Link>
        <Link
          to='/pathfinding'
          className={location.pathname === '/pathfinding' ? 'active' : undefined}>
          Pathfinding Algorithms
        </Link>
      </div>
      <Switch >
        <Route exact path='/' component={HomePage} />
        <Route exact path='/sort' component={SortContainer} />
        <Route exact path='/pathfinding' component={PathfindingContainer} />
      </Switch>
    </div>
  );
};

export default Router;
