import React, { Component } from 'react';
import './App.css';

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
        <h1>Star Wars Search</h1>
      </main>
    );
  }
}

export default App;
