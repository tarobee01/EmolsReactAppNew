import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initializeApp } from "firebase/app";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

const firebaseConfig = {
  apiKey: "AIzaSyAnZAKMJBZiwTDIuB4kMj1Mv6v_lBI3SlU",
  authDomain: "drop-cal.firebaseapp.com",
  projectId: "drop-cal",
  storageBucket: "drop-cal.appspot.com",
  messagingSenderId: "375066389820",
  appId: "1:375066389820:web:123bfe35c65efcc6548239",
  measurementId: "G-9DS77ELZSY"
};

initializeApp(firebaseConfig);
