import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FormattedHTMLMessage } from 'react-intl';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import jwt_decode from 'jwt-decode';

import HeaderNav from './components/Header/Nav';

addLocaleData([...en, ...es]);

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      loginSession: {},
    };
  }

  componentWillMount() {
    var encodedToken = localStorage.getItem('jwtToken');
    if (encodedToken) {
      try {
        this.setState({ loginSession: this.decodeLoginSession(encodedToken) });
        this.saveStoredSession(this.state.loginSession);
      } catch (error) {
        this.logOut();
        return;
      }
    }
    this.getUserData();
  }

  getUserData() {
    fetch(process.env.REACT_APP_API_URL + '/Reports/Reports/GetUserData', {
      mode: 'cors',
      credentials: 'include',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.jwtToken) {
          this.logOut();
        } else {
          this.setState({ user: data.user });
          this.saveStoredSession({ token: data.jwtToken });
        }
      })
      .catch((error) => {
        this.logOut();
      });
  }

  decodeLoginSession(jwtToken) {
    var decodedToken = jwt_decode(jwtToken);
    return {
      token: jwtToken,
      email: decodedToken.email,
      name: decodedToken.name,
      lang: decodedToken.lang,
    };
  }

  saveStoredSession(loginSession) {
    localStorage.setItem('jwtToken', loginSession.token);
  }

  logOut() {
    localStorage.removeItem('jwtToken');
    window.location.href = process.env.REACT_APP_API_URL + '/SignIn/index?redirect=/webapp';
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.user ? <HeaderNav user={this.state.user} /> : null}
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            <FormattedHTMLMessage id="app.title" />
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FormattedHTMLMessage id="app.link" />
          </a>
        </header>
      </div>
    );
  }
}

export default App;
