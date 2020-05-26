import './scss/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ServiceWorkerController from './sw-controller';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n';

import reduser, {Store} from './reducer';

import App from './components/app';

const store = createStore(reduser, applyMiddleware<any, Store>(thunk));
const serviceWorkerController = new ServiceWorkerController();
serviceWorkerController.launch();
ReactDOM.render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App/>
        <div className="pop-up" id="pop-up"/>
      </I18nextProvider>
    </Provider>,
    document.getElementById('root')
);
