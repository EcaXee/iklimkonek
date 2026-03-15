# IklimKonek

IklimKonek adalah aplikasi web berbasis data iklim untuk membantu petani dan nelayan mengambil keputusan harian secara cepat dan kontekstual.

Proyek ini menggabungkan data cuaca real-time, rule engine rekomendasi aksi, dan forum komunitas agar pengguna bisa mendapatkan insight sekaligus validasi lapangan.

Tautan Website (Live Deployment): https://iklimkonek.biz.id

## Latar Belakang

Informasi cuaca sering tersedia dalam format teknis yang tidak langsung operasional bagi pengguna lapangan. IklimKonek dirancang untuk menjembatani hal tersebut melalui:
- ringkasan kondisi yang mudah dipahami,
- rekomendasi tindakan yang praktis,
- dan ruang diskusi komunitas lokal.

## Fitur Utama

- Dashboard Petani
: Menampilkan suhu, peluang hujan, dan rekomendasi tindakan budidaya.

- Dashboard Nelayan
: Menampilkan suhu, kecepatan angin, dan rekomendasi keselamatan melaut.

- Insight Berbasis Rule
: Rule engine mengubah parameter cuaca menjadi instruksi aksi yang langsung dapat digunakan.

- Forum Komunitas Real-Time
: Forum terpisah untuk petani dan nelayan, mendukung posting dan like secara langsung.

- Manajemen Akun
: Registrasi, login, profil, edit profil, dan upload avatar.

- UI Responsif
: Pengalaman penggunaan konsisten di mobile, tablet, dan desktop.

## Teknologi

- Frontend: HTML, Tailwind CSS, JavaScript (Vanilla)
- Backend: Firebase Authentication, Firestore
- Data Cuaca: Open-Meteo API
- Media Avatar: Cloudinary

## Arsitektur Singkat

1. Pengguna memilih konteks profesi (petani/nelayan).
2. Aplikasi mengambil lokasi (dengan fallback koordinat default).
3. Data cuaca diambil dari Open-Meteo.
4. Rule engine menghasilkan insight tindakan.
5. Dashboard diperbarui dinamis berdasarkan kondisi terbaru.
6. Data forum disinkronkan real-time melalui Firestore.

## Struktur Halaman

- `index.html` - Landing page dan pemilihan profesi.
- `dashboard-petani.html` - Dashboard iklim petani.
- `dashboard-nelayan.html` - Dashboard iklim nelayan.
- `forum-petani.html` - Forum komunitas petani.
- `forum-nelayan.html` - Forum komunitas nelayan.
- `login.html` - Autentikasi masuk.
- `signup.html` - Registrasi akun.
- `profile.html` - Informasi profil pengguna.
- `profile-edit.html` - Pengelolaan profil pengguna.

## Struktur Kode (Inti)

- `js/api.js` - Pengambilan data cuaca dari Open-Meteo.
- `js/engine.js` - Rule engine untuk insight petani/nelayan.
- `js/dashboard-petani.js` - Logika dashboard petani.
- `js/dashboard-nelayan.js` - Logika dashboard nelayan.
- `js/forum.js` - Logika forum petani (post, feed, like).
- `js/forum-nelayan.js` - Logika forum nelayan (post, feed, like).
- `js/auth/login.js` - Proses login.
- `js/auth/signup.js` - Proses registrasi.
- `js/profile.js` - Sinkronisasi dan update data profil.
- `js/sidebar.js` - Komponen sidebar mobile reusable.

## Cara Menjalankan Proyek

Gunakan local server agar semua modul JavaScript berjalan normal.

Opsi 1 (disarankan):
1. Buka folder proyek di VS Code.
2. Jalankan Live Server dari `index.html`.

Opsi 2 (Python):
```bash
python -m http.server 5500
```
Lalu akses `http://127.0.0.1:5500`.

## Pengembangan Lanjutan

- Integrasi deployment production (hosting publik).
- Penyempurnaan observabilitas error dan logging.
- Penambahan automated test untuk flow auth, dashboard, dan forum.

## Tim Pengembang

Dokumen ini disusun untuk memudahkan evaluasi teknis dan pengembangan lanjutan proyek IklimKonek.
