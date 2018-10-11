import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import Login from './Login';
import registerServiceWorker from './registerServiceWorker';
import Home from './Home';
import Pacientes from './Pacientes';
import Pagamentos from './Pagamentos';
import Consultas from './Consultas';

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={Home} /> 
        <Route path="/home" component={Home} />
        <Route path="/pacientes" component={Pacientes} />
        <Route path="/app" component={App} />
        <Route path="/pagamentos" component={Pagamentos} />
        <Route path="/consultas" component={Consultas} />

          {/* <Route component={NoMatch} /> */}
      </Switch>
    </App>
  </BrowserRouter>,
    document.getElementById('root')
);
registerServiceWorker();
