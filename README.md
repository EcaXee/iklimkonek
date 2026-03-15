# IklimKonek

Platform web informasi iklim untuk dua kelompok pengguna utama:
- Petani
- Nelayan

Aplikasi menampilkan insight cuaca berbasis lokasi, dashboard harian, forum komunitas, autentikasi pengguna, dan manajemen profil.

## Ringkasan Fitur

- Dashboard Petani dengan metrik suhu + peluang hujan.
- Dashboard Nelayan dengan metrik suhu + kecepatan angin.
- Insight aksi harian berbasis rule (`engine.js`).
- Forum komunitas real-time (Petani dan Nelayan) menggunakan Firestore.
- Login, signup, profil, dan edit profil.
- Upload avatar profil ke Cloudinary.
- Sidebar mobile reusable lintas halaman.
- Layout responsif untuk mobile, tablet, dan desktop.

## Struktur Halaman

- `index.html`: Landing/home dan pemilihan profesi.
- `dashboard-petani.html`: Dashboard cuaca untuk petani.
- `dashboard-nelayan.html`: Dashboard cuaca untuk nelayan.
- `forum-petani.html`: Forum diskusi petani.
- `forum-nelayan.html`: Forum diskusi nelayan.
- `login.html`: Halaman masuk.
- `signup.html`: Halaman daftar.
- `profile.html`: Halaman profil user.
- `profile-edit.html`: Edit data profil dan foto.
- `components/sidebar.html`: Komponen sidebar mobile.

## Struktur JavaScript

- `js/firebase-config.js`
  - Inisialisasi Firebase App.
  - Export `auth`, `db`, `storage`.

- `js/api.js`
  - Integrasi Open-Meteo.
  - Fungsi `getWeatherData(lat, lng, mode)`.

- `js/engine.js`
  - Rule engine insight cuaca untuk petani/nelayan.

- `js/dashboard-petani.js`
  - Ambil lokasi user.
  - Ambil data cuaca mode petani.
  - Update status, metrik, dan visual dashboard.

- `js/dashboard-nelayan.js`
  - Ambil lokasi user.
  - Ambil data cuaca mode nelayan.
  - Update status, metrik, dan visual dashboard.

- `js/forum.js`
  - Logika forum petani (render feed, kirim post, like).

- `js/forum-nelayan.js`
  - Logika forum nelayan (render feed, kirim post, like).

- `js/profile.js`
  - Sinkronisasi data profil.
  - Update profil ke Firestore.
  - Upload avatar ke Cloudinary.

- `js/sidebar.js`
  - Inject komponen sidebar.
  - Event buka/tutup sidebar + lock scroll body.

- `js/auth/login.js`
  - Login Firebase Auth.

- `js/auth/signup.js`
  - Register Firebase Auth.
  - Simpan data awal user ke Firestore.

## Alur Data Utama

1. User membuka dashboard.
2. Browser meminta izin geolokasi.
3. Sistem memanggil Open-Meteo via `getWeatherData`.
4. Rule engine (`InsightEngine`) menentukan rekomendasi.
5. UI dashboard diperbarui (status, teks insight, warna kartu).

## Forum Real-Time

- Sumber data:
  - `forum_petani` untuk forum petani.
  - `forum_nelayan` untuk forum nelayan.
- Feed di-render real-time dengan `onSnapshot`.
- Like disimpan sebagai array UID (`arrayUnion`/`arrayRemove`).

## Koleksi Firestore yang Digunakan

- `users`
  - `displayName`
  - `handle`
  - `photoURL`
  - metadata lain sesuai kebutuhan

- `forum_petani`
  - `text`, `uid`, `author`, `timestamp`, `likes`, `location`

- `forum_nelayan`
  - `text`, `uid`, `author`, `timestamp`, `likes`, `location`

## Integrasi Eksternal

- Firebase (Auth + Firestore + Storage)
- Open-Meteo API
- Cloudinary (upload avatar)
- Tailwind CDN

## Menjalankan Proyek

Karena ini static multi-page app, jalankan dengan local server.

Contoh (VS Code Live Server):
1. Buka folder proyek.
2. Jalankan Live Server di `index.html`.

Alternatif sederhana (Python):
```bash
python -m http.server 5500
```
Lalu buka `http://127.0.0.1:5500`.

## Panduan Pengembangan

- Pertahankan ID elemen yang dipakai JS (contoh: `stat-temp`, `main-status-desc`).
- Jika mengubah struktur dashboard, cek script terkait agar tidak terjadi mismatch selector.
- Untuk fitur baru forum, update kedua file forum agar behavior tetap konsisten.
- Gunakan komentar blok untuk menjelaskan tujuan modul, bukan komentar per baris yang redundant.

## Catatan Responsif

- Mobile mempertahankan layout inti asli.
- Desktop menambahkan navbar horizontal + container terpusat.
- Halaman dengan konten pendek sudah diatur agar tidak menampilkan scroll kosong.

## Troubleshooting

- Data cuaca tidak tampil:
  - cek izin lokasi browser.
  - cek koneksi internet.

- Forum kosong:
  - pastikan user login.
  - cek aturan Firestore dan koleksi.

- Foto profil gagal upload:
  - cek `CLOUDINARY_UPLOAD_PRESET` di `js/profile.js`.
  - cek network request ke endpoint Cloudinary.

## Saran Lanjutan

- Tambahkan `.env` pattern (build tool) agar kredensial/config lebih aman.
- Tambahkan linting HTML/JS otomatis.
- Tambahkan test UI dasar untuk form auth dan render dashboard.
