import React  from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
import CssBaseline from '@material-ui/core/CssBaseline';

import { reducers } from 'meld-clients-core/lib/reducers'

import App from './App';

const createStoreWithMiddleware = applyMiddleware(thunk, ReduxPromise)(createStore);
const store = createStore(reducers)

ReactDOM.render((
  <Provider store={createStoreWithMiddleware(reducers)}>
    <CssBaseline />
    <App />
  </Provider>
  ), document.querySelector('.container')
);
