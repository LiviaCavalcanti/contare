import React, { Component } from 'react';
import NavbarComponent from './components/navbarComponent/navbarComponent';
import './App.css';
import ContentComponent from './components/contentComponent/contentComponent';

class App extends Component {
  render() {
    return (
      
      <div className="App">
        <NavbarComponent/>
        <ContentComponent/>
        <h1>Hello World</h1>
      </div>
    );
  }
}

export default App;
