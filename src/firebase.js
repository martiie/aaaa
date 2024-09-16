import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; 
import { getFirestore, serverTimestamp } from "firebase/firestore"; // เพิ่ม serverTimestamp

const firebaseConfig = {
  apiKey: "AIzaSyBW6Yjs96CXEtmiokVX8LlWy2ZSvTJfrKw",
  authDomain: "test-b69f2.firebaseapp.com",
  projectId: "test-b69f2",
  storageBucket: "test-b69f2.appspot.com",
  messagingSenderId: "348959440968",
  appId: "1:348959440968:web:6b7eb99a6cb0fe05fdd87d",
  measurementId: "G-VMCEES3F9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and export it
export const db = getFirestore(app);
export { serverTimestamp };