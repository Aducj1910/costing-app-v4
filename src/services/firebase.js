import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxZcVkEQDhmwO0j4M7utQQv8VYXQZ5kvc",
  authDomain: "costing-app-v4.firebaseapp.com",
  projectId: "costing-app-v4",
  storageBucket: "costing-app-v4.appspot.com",
  messagingSenderId: "829515383390",
  appId: "1:829515383390:web:d3d04e77188ad34e65aacf",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();

export default firebase;
