import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import HomePage from '../HomePage/HomePage';
import SortContainer from '../SortModule/SortContainer';
import PathfindingContainer from '../PathfindingModule/PathfindingContainer';

const Router = () => {
  
  return (
    <div className='appContainer'>
      <div className='navigationContainer'>
        <Link to='/'>Algorithms Visualizer</Link>
        <Link to='/sort'>Sorting Algorithms</Link>
        <Link to='/pathfinding'>Pathfinding Algorithms</Link>
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
