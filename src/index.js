import React from 'react';
import ReactDOM from 'react-dom';
import { compose, createStore } from 'redux';
import { Provider } from 'react-redux';

import * as serviceWorker from './serviceWorker';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './index.scss';
import Main from './containers/Main/index';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  composeEnhancer()
);

const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();

export default store;