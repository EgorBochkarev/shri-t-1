import React, {Component} from 'react';
import {Router, Route, Switch} from 'react-router-dom';

import history from '../../history';

import Details from '../pages/details';
import Default from '../pages/default';
import Settings from '../pages/settings';
import Start from '../pages/start';
import History from '../pages/history';
import Footer from '../footer';


export default class App extends Component {
  render() {
    return (
      <div className="page">
        <Router history={history}>
          <Switch>
            <Route exact path="/">
              <Default/>
            </Route>
            <Route path="/start">
              <Start/>
            </Route>
            <Route path="/settings">
              <Settings/>
            </Route>
            <Route path="/history">
              <History/>
            </Route>
            <Route path="/build/:id?">
              <Details/>
            </Route>
            <Route>
              <div>Page not found</div>
            </Route>
          </Switch>
        </Router>
        <Footer/>
      </div>
    );
  };
}
