import { auth, db } from './firebase-config.js';
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Konfigurasi endpoint Cloudinary untuk upload avatar.
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtbhd7w65/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "iklimkonek";

let selectedFile = null;
const avatarImg = document.getElementById('edit-avatar');
const fileInput = document.getElementById('file-input');

// 1) Validasi status login dan isi data profil yang ada.
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            // Isi tampilan profil (untuk halaman profile.html).
            if (document.getElementById('display-name')) {
                document.getElementById('display-name').textContent = data.displayName;
                document.getElementById('display-handle').textContent = `@${data.handle}`;
                document.getElementById('display-avatar').src = data.photoURL;
            }
            // Isi form edit (untuk halaman profile-edit.html).
            if (document.getElementById('input-name')) {
                document.getElementById('input-name').value = data.displayName || "";
                document.getElementById('input-handle').value = data.handle || "";
                avatarImg.src = data.photoURL || `https://ui-avatars.com/api/?name=${data.displayName}&background=0D9488&color=fff`;
            }
        }
    } else {
        window.location.href = "login.html";
    }
});

// 2) Preview avatar lokal sebelum benar-benar diupload.
if (avatarImg && fileInput) {
    avatarImg.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
        selectedFile = e.target.files[0];
        if (selectedFile) {
            avatarImg.src = URL.createObjectURL(selectedFile);
        }
    };
}

// 3) Upload file ke Cloudinary, lalu kembalikan URL hasil transformasi.
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData
    });

    if (!response.ok) throw new Error("Gagal upload ke Cloudinary");

    const data = await response.json();
    
    // Pakai transformasi square + face focus agar avatar konsisten.
    return data.secure_url.replace("/upload/", "/upload/w_500,h_500,c_fill,g_face,q_auto,f_auto/");
}

// 4) Simpan perubahan profil ke Firestore.
const editForm = document.getElementById('edit-profile-form');
if (editForm) {
    editForm.onsubmit = async (e) => {
        e.preventDefault();
        const btnSave = e.target.querySelector('button');
        btnSave.disabled = true;
        btnSave.innerHTML = `<span class="animate-pulse">Sedang Mengupload...</span>`;

        try {
            const user = auth.currentUser;
            let finalPhotoURL = avatarImg.src;

            // Jika user memilih file baru, upload dulu sebelum update profil.
            if (selectedFile) {
                finalPhotoURL = await uploadToCloudinary(selectedFile);
            }

            // Update dokumen user pada koleksi users.
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                displayName: document.getElementById('input-name').value.trim(),
                handle: document.getElementById('input-handle').value.trim().replace('@', ''),
                photoURL: finalPhotoURL
            });

            alert("Profil berhasil diperbarui!");
            window.location.href = "profile.html";
        } catch (error) {
            console.error("Error Detail:", error);
            alert("Gagal mengupdate profil. Pastikan Preset Cloudinary benar!");
            btnSave.disabled = false;
            btnSave.textContent = "Simpan Perubahan";
        }
    };
}