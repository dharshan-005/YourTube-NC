// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjT_xQAUFG4rKBFIsQMZE9qddFwwKECnw",
  authDomain: "nc-4aca1.firebaseapp.com",
  projectId: "nc-4aca1",
  storageBucket: "nc-4aca1.firebasestorage.app",
  messagingSenderId: "1066279365663",
  appId: "1:1066279365663:web:a1b49a5b822019e849792a",
  measurementId: "G-SVJ18CV5HN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export { auth, provider }