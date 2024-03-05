import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyDTKitAQwDarrLn9MxpSjsUqcvPAo5JWC4",
    authDomain: "team-project-2a96b.firebaseapp.com",
    projectId: "team-project-2a96b",
    storageBucket: "team-project-2a96b.appspot.com",
    messagingSenderId: "274088894200",
    appId: "1:274088894200:web:3a11f9b7d89841f92fe50d"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
