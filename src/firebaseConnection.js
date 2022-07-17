import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyAxbiFybZtBy5fL5WUvOjFTbft2hxFT4Io",
    authDomain: "udemy-firebase-b078c.firebaseapp.com",
    projectId: "udemy-firebase-b078c",
    storageBucket: "udemy-firebase-b078c.appspot.com",
    messagingSenderId: "993359238746",
    appId: "1:993359238746:web:999c25a7b84d5a04536a63",
    measurementId: "G-3RZLFT4PZW"
  };

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;