import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {

  return (
    <div className='moduleContainer homePage'>
      <div className='homePage__content'>
        <h1>Algorithms Visualizer</h1>
        <p>
          This app is currently under development.<br/>
          You may already check out visualizations of a few sorting and pathfinding algorithms :)<br/>
        </p>
        <div>
          <Link to='/pathfinding'>Pathfinding and Maze Generation Algorithms</Link>
          <p>
            See visualizations of most common pathfinding algorithms.<br/>
            Algorithmically generate mazes.<br/>
            Paint walls, move start and finish points and see how algorithms work in different situations.
          </p>
        </div>
        <div>
          <Link to='/sort'>Sorting Algorithms</Link>
          <p>See visualizations of selection, bubble and quick sort.<br/>
            Modify size of data and visualization speed.
          </p>
        </div>
      </div>
      <div className='homePage__footer'>
        <p className='label'>Icons made by <a href='https://www.flaticon.com/authors/flat-icons' title='Flat Icons'>Flat Icons</a> from <a href='https://www.flaticon.com/' title='Flaticon'> www.flaticon.com</a></p>
      </div>
    </div>
  );
};

export default HomePage;
