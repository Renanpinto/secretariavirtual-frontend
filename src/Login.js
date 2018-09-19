import React from 'react';
import './Login.css';

class Login extends React.Component {
  render() {
    return (
      <div className="container-login">
      <div className="container">
      <form id="login" action="/home">
        <div className="row row-input">
          <label htmlFor="email" className="icon"><img src="https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Mail-512.png" alt="Email"/></label>
          <input className="input" id="email" type="text" name="email" placeholder="Email" autofocus/>
        </div>
        <div className="row row-input">
          <label htmlFor="password" className="icon"><img src="https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Lock-512.png" alt="Senha"/></label>
          <input className="input" id="password" type="password" name="password" placeholder="Senha"/>
        </div>
        <div className="row row-text">
          <input type="checkbox" name="remember" checked/>Lembrar <br/>
          <p id="restore-password" className="pointer">Esqueceu a senha?</p>
        </div>
        <input type="submit" name="submit" value="LOGIN" className="submit"/>
        <div className="row row-text">
          <p id="login-switch" className="pointer">Cadastre-se</p>
        </div>
      </form>
    
    </div>
    </div>
    );
  }
}

export default Login;
