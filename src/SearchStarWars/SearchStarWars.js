import React, { Component } from 'react';
import './SearchStarWars.css';

class SearchStarWars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiPeople: [],
      searchName: '',
      matchingIndices: [],
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
    let myMatchingIndices = this.state.matchingIndices;    
    let regex = new RegExp(this.state.searchName, 'i');
    this.state.apiPeople.forEach((result, index) => {
      if (result.name.match(regex)) {
        myMatchingIndices.push(index);        
      }
    });
    
    this.setState(
      {
        matchingIndices: myMatchingIndices,        
        loading: false
      }
    );
  }

  displayResults() {
    const results = this.state.matchingIndices.map((index, i) => 
      <>
      <h2>- { this.state.apiPeople[index].name } -</h2>
      <ul>
        <li key={i}>
          Birth Year: { this.state.apiPeople[index].birth_year }
        </li>
        <li key={i}>
          Gender: { this.state.apiPeople[index].gender }
        </li>
        <li key={i}>
          Height: { this.state.apiPeople[index].height }
        </li>        
      </ul>
      </>);
    if (results.length > 0) {
      return (
      <>
        <div>
          <h2>Names Matching { this.state.searchName }</h2>
            { results }
        </div>      
      </>
      );
    }
    return (<></>);
  }

  onChangeInput(name) {
    const newState = this.state;
    newState.searchName = name;
    newState.matchingIndices = [];    

    this.setState(
      { newState }
    );
  }

  handleReset(event) {
    event.preventDefault();
    const newState = this.state;
    newState.searchName = '';
    newState.matchingIndices = [];          

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
        let myResults = this.state.apiPeople;
        resJson.results.forEach(result => {
          myResults.push(result);
        });
        this.setState({
          apiPeople: myResults
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
      apiPeople: [],
      matchingIndices: [],
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
