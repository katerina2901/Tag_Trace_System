import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { initializeApp } from 'firebase/app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const firebaseConfig = {

  apiKey: "AIzaSyDEHH8IhCbAexNA_5kR43ewNW2K8Pzsiog",
  authDomain: "tagtracesystem-6aab6.firebaseapp.com",
  projectId: "tagtracesystem-6aab6",
  storageBucket: "tagtracesystem-6aab6.appspot.com",
  messagingSenderId: "192198176585",
  appId: "1:192198176585:web:380a0d9455a2032560b498"

};


// Initialize Firebase
initializeApp(firebaseConfig);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
