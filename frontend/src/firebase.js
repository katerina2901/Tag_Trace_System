import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {

    apiKey: "AIzaSyDEHH8IhCbAexNA_5kR43ewNW2K8Pzsiog",
    authDomain: "tagtracesystem-6aab6.firebaseapp.com",
    projectId: "tagtracesystem-6aab6",
    storageBucket: "tagtracesystem-6aab6.appspot.com",
    messagingSenderId: "192198176585",
    appId: "1:192198176585:web:380a0d9455a2032560b498"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
