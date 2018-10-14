import React from 'react';
import './css/Login.css';
import { Redirect } from 'react-router-dom';

class Login extends React.Component {
    state = {
      redirect: false
    }

    enviaLogin(event) {
      event.preventDefault();
      switch (this.login.value) {
        case 'user@email.com':
          localStorage.setItem('auth-token', this.login.value);
          this.setState({redirect: true})
          break;
        default:
          break;
      }

  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to='/'/>;
    }
    return (
      <div className="container-login">
      <div className="container">
      <form id="login" onSubmit={(this.enviaLogin.bind(this))}>
        <div className="row row-input">
          <label htmlFor="email" className="icon"><img src="https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Mail-512.png" alt="Email"/></label>
          <input className="input" ref={(input) => this.login = input} id="email" type="text" name="email" placeholder="Email" autoFocus/>
        </div>
        <div className="row row-input">
          <label htmlFor="password" className="icon"><img src="https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Lock-512.png" alt="Senha"/></label>
          <input className="input" ref={(input) => this.senha = input} id="password" type="password" name="password" placeholder="Senha"/>
        </div>
        <div className="row row-text">
          <input type="checkbox" name="remember" defaultChecked/>Lembrar <br/>
          <p id="restore-password" className="pointer">Esqueceu a senha?</p>
        </div>
        <input type="submit" name="submit" value="login" className="submit"/>
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
