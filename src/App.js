import React, { Component } from 'react';
import './App.css';
import MenuLateral from './components/Menu';
import TopMenu from './components/TopMenu';

class App extends Component {
 
  render() {
    return (
      <div className="dashboard">
      <TopMenu/>
      <MenuLateral/>
      
      <main className="content-wrap">
        {this.props.children}
      </main>
    </div>
    );
  }
}

export default App;
