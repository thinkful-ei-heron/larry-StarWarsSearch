import React, { Component } from 'react';
import './App.css';
import SearchStarWars from './SearchStarWars/SearchStarWars';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nothing: ''
    };
  }
  
  render() {
    return (
      <main className='App'>
        <h1>Star Wars Database</h1>
        <SearchStarWars />
      </main>
    );
  }
}

export default App;
