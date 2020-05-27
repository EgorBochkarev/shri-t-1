import './scss/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ServiceWorkerController from './sw-controller';
import i18n from "i18next";
import {initReactI18next, I18nextProvider} from "react-i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import reduser, {Store} from './reducer';

import App from './components/app';

const store = createStore(reduser, applyMiddleware<any, Store>(thunk));
const serviceWorkerController = new ServiceWorkerController();
serviceWorkerController.launch();

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: false,
    whitelist: ['en', 'ru'],
    debug: true,
    detection: {
      lookupCookie: 'i18next',
      caches: ['cookie']
    },
    load: 'currentOnly',
    react: { 
      useSuspense: false
    }
  }).then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <App/>
          <div className="pop-up" id="pop-up"/>
        </I18nextProvider>
      </Provider>,
      document.getElementById('root')
    );
  })

