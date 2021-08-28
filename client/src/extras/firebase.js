import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

export const app = firebase.apps.length === 0 ?
    firebase.initializeApp({
        apiKey: "AIzaSyAMspr5TIlQZJHAmQ6TvOjGnePuBGTSzRo",
        authDomain: "dogsapp-f043d.firebaseapp.com",
        projectId: "dogsapp-f043d",
        storageBucket: "dogsapp-f043d.appspot.com",
        messagingSenderId: "881747353716",
        appId: "1:881747353716:web:d81849c4e3b7797c2ab121",
        measurementId: "G-MD5S1G9PZ8"
    })
    :
    firebase;


export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export async function uploadImage(username, imageAsFile) {
    try {
        await app.storage().ref(`/tests/${username}ProfilePic`).put(imageAsFile)
        const url = await app.storage().ref('tests').child(`${username}ProfilePic`).getDownloadURL()
        return url
    } catch (e) {
        return 'Sorry, we could not upload your new profile picture'
    }
}

export async function uploadConfirmedImage(username, imageAsFile) {
    try {
        await app.storage().ref(`/profilePictures/${username}ProfilePic`).put(imageAsFile)
        const url = await app.storage().ref('profilePictures').child(`${username}ProfilePic`).getDownloadURL()
        return url
    } catch (e) {
        return 'Sorry, we could save your new profile picture'
    }
}
