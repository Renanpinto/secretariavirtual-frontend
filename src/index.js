import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
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
    <Switch>
        <Route exact path="/" component={Login} /> 
        <Route exact path="/login" component={Login} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/pacientes" component={Pacientes} />
        <Route exact path="/app" component={App} />
        <Route exact path="/pagamentos" component={Pagamentos} />
        <Route exact path="/consultas" component={Consultas} />

        {/* <Route component={NoMatch} /> */} */}
    </Switch>
</BrowserRouter>,

  
    document.getElementById('root'));
registerServiceWorker();
