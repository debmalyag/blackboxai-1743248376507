// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDummyKey1234567890",
  authDomain: "emergency-response-app.firebaseapp.com",
  projectId: "emergency-response-app",
  storageBucket: "emergency-response-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage };