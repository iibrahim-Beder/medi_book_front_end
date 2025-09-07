import { Provider } from "react-redux";
import { store, persistor } from "./redux/Stor";
import { PersistGate } from "redux-persist/integration/react";
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from "./context/ThemeContext"; // الاستيراد الجديد

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './assets/css/bootstrap.min.css';
import './assets/css/dashboard.css';
import './assets/css/dbresponsive.css';
import './assets/css/font-awesome.min.css';
import './assets/css/animate.css';
import './assets/css/scrollbar.css';
import { BrowserRouter } from "react-router-dom";
import './assets/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/css/transitions.css'
import "leaflet/dist/leaflet.css";
import $ from 'jquery';
import './i18n';
window.$ = window.jQuery = $;



const applyInitialTheme = () => {
  try {
    const savedState = localStorage.getItem('persist:root');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      const themeState = JSON.parse(parsed.theme || '{}');
      const initialDarkMode = themeState.darkMode === 'true';
      document.documentElement.setAttribute(
        'data-theme',
        initialDarkMode ? 'dark' : 'light'
      );
    }
  } catch (e) {
    console.error('Error reading initial theme:', e);
  }
};

applyInitialTheme();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
      <BrowserRouter>
        <ThemeProvider>
    <App />
  </ThemeProvider>
      </BrowserRouter>
    {/* </PersistGate> */}
  </Provider>
);

reportWebVitals();