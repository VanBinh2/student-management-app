// Firebase configuration - using REST API approach
export const firebaseConfig = {
  apiKey: "AIzaSyBq6jkPCdKauqkJWhtKLo-wH9qDdPQbR3w",
  authDomain: "student-app-53158.firebaseapp.com",
  projectId: "student-app-53158",
  storageBucket: "student-app-53158.firebasestorage.app",
  messagingSenderId: "747967696084",
  appId: "1:747967696084:web:3c7fa78d5c8bead95cbf41",
  measurementId: "G-X65QCRC4G2",
}

// Firebase Auth REST API base URL
export const AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts`
export const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`
