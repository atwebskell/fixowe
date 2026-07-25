// Firebase Production Configuration for Fixowe
const firebaseConfig = {
  apiKey: "AIzaSyBY_zmOFHyYb1dHOR2-v-KtzKHe-4ckqTg",
  authDomain: "fixowe.firebaseapp.com",
  projectId: "fixowe",
  storageBucket: "fixowe.firebasestorage.app",
  messagingSenderId: "693207153969",
  appId: "1:693207153969:web:3c176ea99f2425ca8d4410",
  measurementId: "G-NM7QG06R43"
};

// Initialize Firebase SDK
let firebaseApp = null;
let db = null;
let storage = null;

if (typeof firebase !== 'undefined') {
  try {
    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
      firebaseApp = firebase.app();
    }
    db = firebase.firestore();
    storage = firebase.storage();
    console.log("Fixowe Firebase Production initialized successfully!");
  } catch (e) {
    console.error("Firebase Initialization Error:", e);
  }
}
