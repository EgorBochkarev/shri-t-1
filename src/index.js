import './scss/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';

import reduser from './reducer';

import App from './components/app';

const store = createStore(reduser, applyMiddleware(thunk));
ReactDOM.render(<Provider store={store}><App/></Provider>,
    document.getElementById('root'));
