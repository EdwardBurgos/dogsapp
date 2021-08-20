import firebase from 'firebase/app';
import 'firebase/auth';

export const app = firebase.initializeApp({
    apiKey: "AIzaSyAMspr5TIlQZJHAmQ6TvOjGnePuBGTSzRo",
    authDomain: "dogsapp-f043d.firebaseapp.com",
    projectId: "dogsapp-f043d",
    storageBucket: "dogsapp-f043d.appspot.com",
    messagingSenderId: "881747353716",
    appId: "1:881747353716:web:d81849c4e3b7797c2ab121",
    measurementId: "G-MD5S1G9PZ8"
});

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// export {app, googleAuthProvider};