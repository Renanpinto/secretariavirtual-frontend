import React, { Component } from 'react';
import { Redirect } from  'react-router-dom';

export default class Logout extends Component {
  state = {
    redirect: false
  }
    componentWillMount() {
        localStorage.removeItem('auth-token');
        this.setState({redirect: true})
    }

    render() {
      const { redirect } = this.state;
      if (redirect) {
        return <Redirect to='/login'/>;
      }
      return null;
    }
}