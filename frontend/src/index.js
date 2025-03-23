import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';  // Import the Provider
import App from './App';
import store from './redux/store';  // Import your Redux store
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Create a root
root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Wrap your app with the Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
