// Import modul Firebase yang dipakai di proyek.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyB57Z_g0gXUISBnZ34BePkYCUuVmI52Mck",
  authDomain: "iklimkonek-app.firebaseapp.com",
  projectId: "iklimkonek-app",
  storageBucket: "iklimkonek-app.firebasestorage.app",
  messagingSenderId: "1037864130900",
  appId: "1:1037864130900:web:df57a67bb15831fc3710c1",
  measurementId: "G-QPNHPTZ1DP"
};

// Inisialisasi aplikasi Firebase.
const app = initializeApp(firebaseConfig);

// Export service agar bisa dipakai modul lain (auth, forum, profil, dsb).
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);