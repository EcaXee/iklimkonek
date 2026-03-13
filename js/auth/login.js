// Tambahkan ../ agar dia keluar dari folder 'auth' untuk mencari config
import { auth } from '../firebase-config.js'; 
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.querySelector('form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = loginForm.querySelectorAll('input');
    const email = inputs[0].value;    
    const password = inputs[1].value; 

    try {
        console.log("Mencoba login...");
        await signInWithEmailAndPassword(auth, email, password);
        
        // Karena login.html ada di folder utama, index.html juga di folder utama,
        // maka pemanggilan "index.html" di sini sudah benar.
        window.location.href = "index.html"; 
    } catch (error) {
        console.error("Error Detail:", error.code);
        let message = "Gagal Masuk: ";
        if (error.code === 'auth/invalid-credential') message += "Username atau Password salah.";
        else if (error.code === 'auth/invalid-email') message += "Format email tidak valid.";
        else message += "Terjadi kesalahan sistem (" + error.code + ")";
        
        alert(message);
    }
});