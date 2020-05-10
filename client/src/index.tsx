import './scss/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ServiceWorkerController from './sw-controller';

import reduser, {Store} from './reducer';

import App from './components/app';

const store = createStore(reduser, applyMiddleware<any, Store>(thunk));
const serviceWorkerController = new ServiceWorkerController();
serviceWorkerController.launch();
ReactDOM.render(
    <Provider store={store}>
      <App/>
      <div className="pop-up" id="pop-up"/>
    </Provider>,
    document.getElementById('root')
);
