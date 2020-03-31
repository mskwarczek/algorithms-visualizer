import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {

  return (
    <div className='moduleContainer homePage'>
      <h1>Algorithms Visualizer</h1>
      <p>This app is currently under development.<br/>However, you may already check out visualizations of a few soriting algorithms :)</p>
      <Link to='/sort'>Sorting Algorithms</Link>
    </div>
  );
};

export default HomePage;
