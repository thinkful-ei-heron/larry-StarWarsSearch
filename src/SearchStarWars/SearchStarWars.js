import React, { Component } from 'react';
import './SearchStarWars.css';

class SearchStarWars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResults: [],
      searchName: '',
      matchingNames: [],
      loading: false
    };
  }

  displayLoader() {
    let loader;
    if (this.state.loading) 
    {
      loader = <div className="loader"></div>
    }

    return loader;
  }

  sortResults() {
    let myMatchingNames = this.state.matchingNames;
    let regex = new RegExp(this.state.searchName, 'i');
    this.state.apiResults.forEach(result => {
      if (result.name.match(regex)) myMatchingNames.push(result.name);
    });
    
    this.setState(
      {
        matchingNames: myMatchingNames,
        loading: false
      }
    );
  }

  displayResults() {
    const results = this.state.matchingNames.map((name, i) => 
      <li key={i}>{ name }</li>);
    if (results.length > 0) {
      return (
      <div>
        <h2>Names Matching { this.state.searchName }</h2>
        <ul>
          { results }
        </ul>
      </div>
      );
    }
    return (<></>);
  }

  onChangeInput(name) {
    const newState = this.state;
    newState.searchName = name;
    newState.matchingNames = [];

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
      matchingNames: [],
      loading: true
    });
    const baseURL = 'https://swapi.co/api/';    
    this.fetchResults(`${baseURL}people/`);
  }

  render() {
    return (
      <section className="mainPage">
        <form className='searchForm' onSubmit={event => this.handleSubmit(event)}>
          <fieldset>
            <legend>Search</legend>
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
      { this.displayLoader() }
      { this.displayResults() }
      </section>
    );
  }
}

export default SearchStarWars;
