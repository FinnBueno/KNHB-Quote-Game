import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import firebase from 'firebase/app';
import reportWebVitals from './reportWebVitals';
import App from './App';
import './index.css';

import 'firebase/auth';

firebase.initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

firebase.app().functions('europe-west1');

console.log(`This is version ${import.meta.env.VITE_VERSION}`);

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <meta charSet='utf-8' />
      <title>KNHB Quotes</title>
      <link rel='preconnect' href='https://fonts.gstatic.com' />
    </Helmet>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
