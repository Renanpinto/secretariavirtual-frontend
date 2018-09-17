import React, { Component } from 'react';
import './home.css';
import MenuLateral from './components/Menu';
import TopMenu from './components/TopMenu';
import Agenda from './components/agenda';

class Consultas extends Component {

  render() {
    return (
      <div className="dashboard">
      <TopMenu/>
      <MenuLateral/>
      <main className="content-wrap">
        <Agenda/>
      </main>
    </div>
    );
  }
}

export default Consultas;
