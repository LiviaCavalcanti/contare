import React, { Component } from 'react';
import './App.css';
import ContentComponent from './components/contentComponent/contentComponent';
class App extends Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <ContentComponent component={this.props.component}/>
      </div>
    );
  }
}

export default App;
