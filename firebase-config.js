// Official Firebase Production Configuration for Fixowe (fixowe-95b17)
const firebaseConfig = {
  apiKey: "AIzaSyCOyivSYLlnBNknBbEcapC4NwuHj61tgsE",
  authDomain: "fixowe-95b17.firebaseapp.com",
  projectId: "fixowe-95b17",
  storageBucket: "fixowe-95b17.firebasestorage.app",
  messagingSenderId: "353088131210",
  appId: "1:353088131210:web:5af84f1862296a87f8dd73",
  measurementId: "G-MKNH4B1YXL"
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
    console.log("Fixowe Firebase Production (fixowe-95b17) initialized successfully!");
  } catch (e) {
    console.error("Firebase Initialization Error:", e);
  }
}
