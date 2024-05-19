import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDhwM2ubniJ489Z5SkBiXCg5sBILdyn2Wk",
    authDomain: "dressify-5bdbc.firebaseapp.com",
    projectId: "dressify-5bdbc",
    storageBucket: "dressify-5bdbc.appspot.com",
    messagingSenderId: "259597639891",
    appId: "1:259597639891:web:925ed21c19e97bb774f426"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get the Firebase Auth and Firestore instances
const auth = getAuth(app);

const db = getFirestore(app); // Pass 'app' to getFirestore

export { auth, db };
