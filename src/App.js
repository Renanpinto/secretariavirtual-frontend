import React, { Component } from 'react';
import './App.css';
import MenuLateral from './components/Menu';
import TopMenu from './components/TopMenu';

class App extends Component {
 
  render() {
    console.log(window.location.href);
    if (window.location.href.includes('/login')) {
      return (
        <main>
          {this.props.children}
        </main>
      )
    }
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
