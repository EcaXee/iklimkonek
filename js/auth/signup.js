import { auth, db } from '../firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const signupForm = document.querySelector('form');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = signupForm.querySelectorAll('input');
    const nama = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;
    const confirmPw = inputs[3].value;

    // Validasi Konfirmasi Password
    if (password !== confirmPw) {
        alert("Konfirmasi password tidak cocok!");
        return;
    }

    // Validasi Panjang Password (Syarat Firebase minimal 6)
    if (password.length < 6) {
        alert("Password minimal harus 6 karakter!");
        return;
    }

    try {
        // 1. Buat akun di Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Simpan Data Nama ke Firestore
        await setDoc(doc(db, "users", user.uid), {
            nama: nama,
            email: email,
            role: "pengguna",
            createdAt: new Date().toISOString()
        });

        alert("Pendaftaran Berhasil! Silakan Masuk.");
        window.location.href = "login.html";

    } catch (error) {
        let message = "Gagal Daftar: ";
        if (error.code === 'auth/email-already-in-use') message += "Email sudah terdaftar.";
        else message += error.message;
        alert(message);
    }
});