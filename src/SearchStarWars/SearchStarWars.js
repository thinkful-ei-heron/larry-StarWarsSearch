import React, { Component } from 'react';
import './SearchStarWars.css';

class SearchStarWars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResults: [],
      searchName: '',
      matchingNames: []
    };
  }

  sortResults() {
    let myMatchingNames = this.state.matchingNames;
    this.state.apiResults.forEach(result => {
      let found = result.name.match(this.state.searchName);
      if (found) myMatchingNames.push(result.name);
    });
    
    this.setState(
      {
        matchingNames: myMatchingNames
      }
    );
  }

  displayResults() {
    const results = this.state.matchingNames.map((name, i) => 
      <li key={i}>Match {i + 1}: { name }</li>);
    return (
      <ul>
        { results }
      </ul>
    );
  }

  onChangeInput(name) {
    const newState = this.state;
    newState.searchName = name;

    this.setState(
      { newState }
    );
  }

  handleReset(event) {
    event.preventDefault();
    const newState = this.state;
    newState.searchName = '';

    this.setState (
      { newState }
    );
  }

  fetchResults(url) {
    const options = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }
    
    fetch(`${url}`, options)
      .then(res => res.json())
      .then(resJson => {
        let myResults = this.state.apiResults;
        resJson.results.forEach(result => {
          myResults.push(result);
        });
        this.setState({
          apiResults: myResults
        });
        
        if (resJson.next) {
          this.fetchResults(resJson.next);
        }
        else (this.sortResults());
      })
      .catch(e => console.log(`Error: ${e.message}`)
    );
  }     
  
  handleSubmit(event) {
    event.preventDefault();
    this.setState (
    {
      apiResults: [],
      matchingNames: []
    });
    const baseURL = 'https://swapi.co/api/';    
    this.fetchResults(`${baseURL}people/`);
  }

  render() {
    return (
      < >
      <form className='searchForm' onSubmit={event => this.handleSubmit(event)}>
        <fieldset>
          <legend>Name Search</legend>
          <input
            type="text"
            name="name"
            id="search"
            placeholder="Search Name"
            value={this.state.searchName}
            onChange={event => this.onChangeInput(event.target.value)}
          />
          <div className="searchname__buttons">
            <button onClick={event => this.handleReset(event)}>Reset</button>
            <button type="submit">Submit</button>
          </div>
        </fieldset>
      </form>
        { this.displayResults() }
      </ >
    );
  }
}

export default SearchStarWars;
