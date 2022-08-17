import ReactDOM from 'react-dom/client';
import './global.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store/index';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
