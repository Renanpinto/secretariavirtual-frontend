import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import App from './App';
import Login from './Login';
import Logout from './Logout';
import registerServiceWorker from './registerServiceWorker';
import Home from './pages/Home';
import Pacientes from './pages/Pacientes';
import Pagamentos from './pages/Pagamentos';
import Consultas from './pages/Consultas';

function verificaAutenticacao(nextState,replace) {
  console.log(localStorage.getItem('auth-token'))
  if(localStorage.getItem('auth-token') == null) {
    return false;
  }
  return true

}

ReactDOM.render(
  <BrowserRouter>
    <App >
   
      <Switch>
        <Route exact path="/login" render={() => (verificaAutenticacao() ? (<Redirect to="/home"/>) : (<Login/>))} />
        <Route exact path="/"  render={() => (verificaAutenticacao() ? (<Home />) : (<Redirect to="/login"/>))}/> 
        <Route exact path="/home" render={() => (verificaAutenticacao() ? (<Home />) : (<Redirect to="/login"/>))}/>
        <Route exact path="/pacientes" render={() => (verificaAutenticacao() ? (<Pacientes />) : (<Redirect to="/login"/>))}/> 
        <Route exact path="/app" component={App} />
        <Route exact path="/pagamentos" render={() => (verificaAutenticacao() ? (<Pagamentos />) : (<Redirect to="/login"/>))}/>
        <Route exact path="/consultas" render={() => (verificaAutenticacao() ? (<Consultas />) : (<Redirect to="/login"/>))}/>
        <Route exact path="/logout" component={Logout}/>
          {/* <Route component={NoMatch} /> */}
      </Switch>
    </App>
  </BrowserRouter>,
   document.getElementById('root')
);
registerServiceWorker();
