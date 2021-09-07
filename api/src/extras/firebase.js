const admin = require('firebase-admin');
require ('firebase-admin/lib/storage');
const serviceAccount = require('./dogsapp-f043d-firebase-adminsdk-v31na-84c38f269c.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://dogsapp-f043d.appspot.com/'
})

  //
//   credential: admin.credential.applicationDefault(),
//   storageBucket: 'gs://dogsapp-f043d.appspot.com/'
//   }

    // apiKey: "AIzaSyAMspr5TIlQZJHAmQ6TvOjGnePuBGTSzRo",
        // authDomain: "dogsapp-f043d.firebaseapp.com",
        // projectId: "dogsapp-f043d",
        // storageBucket: "dogsapp-f043d.appspot.com",
        // messagingSenderId: "881747353716",
        // appId: "1:881747353716:web:d81849c4e3b7797c2ab121",
        // measurementId: "G-MD5S1G9PZ8"

async function deleteImage(origin, fileName) {
    try {
        if (origin === 'testsProfilePictures') await admin.storage().bucket().file(`testsProfilePictures/${fileName}ProfilePic`).delete();
        if (origin === 'pets' && fileName) await admin.storage().bucket().file(`petsPictures/${fileName}`).delete();
        if (origin === 'testsPets') await admin.storage().bucket().file(`testsPetsPictures/${fileName}`).delete();
        if (origin === 'deletePet') await admin.storage().bucket().file(`petsPictures/${fileName}`).delete();
    } catch (e) {
        return 'Sorry, we could not delete the image';
    }
}

module.exports.deleteImage = deleteImage;
module.exports.admin = admin;

// export async function uploadConfirmedImage(username, imageAsFile) {
//     try {
//         await app.storage().ref(`/profilePictures/${username}ProfilePic`).put(imageAsFile)
//         const url = await app.storage().ref('profilePictures').child(`${username}ProfilePic`).getDownloadURL()
//         return url
//     } catch (e) {
//         return 'Sorry, we could not save your new profile picture'
//     }
// }

// export async function uploadPetImage(pet, imageAsFile) {
//     try {
//         await app.storage().ref(`/testsPetsPictures/${pet}`).put(imageAsFile)
//         const url = await app.storage().ref('testsPetsPictures').child(`${pet}`).getDownloadURL()
//         return url
//     } catch (e) {
//         return 'Sorry, we could not upload your pet picture'
//     }
// }

// export async function uploadConfirmedPetImage(pet, imageAsFile) {
//     try {
//         await app.storage().ref(`/petsPictures/${pet}`).put(imageAsFile)
//         const url = await app.storage().ref('petsPictures').child(`${pet}`).getDownloadURL()
//         return url
//     } catch (e) {
//         return 'Sorry, we could not save your pet picture'
//     }
// }