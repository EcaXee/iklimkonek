/**
 * Fungsi untuk memuat file sidebar.html secara dinamis
 */
async function loadSidebar() {
    try {
        // 1. Ambil file sidebar dari folder components
        const response = await fetch('components/sidebar.html');
        
        if (!response.ok) {
            throw new Error(`Gagal memuat sidebar. Status: ${response.status}`);
        }

        const sidebarHTML = await response.text();

        // 2. Suntikkan ke bagian paling bawah body agar tidak merusak struktur utama
        document.body.insertAdjacentHTML('beforeend', sidebarHTML);

        // 3. Inisialisasi logika interaksi setelah HTML disuntikkan
        initSidebarLogic();

    } catch (error) {
        console.error("Error Sidebar:", error);
    }
}

/**
 * Logika Buka-Tutup Sidebar
 */
function initSidebarLogic() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btnOpen = document.getElementById('btn-menu'); // Tombol burger di header
    const btnClose = document.getElementById('close-sidebar'); // Tombol silang di sidebar

    // Fungsi helper untuk toggle class
    const toggleMenu = () => {
        if (sidebar && overlay) {
            sidebar.classList.toggle('translate-x-full');
            overlay.classList.toggle('hidden');
            // Mencegah body di-scroll saat menu terbuka
            document.body.classList.toggle('overflow-hidden');
        }
    };

    // Pasang Event Listener dengan pengecekan elemen
    if (btnOpen) btnOpen.onclick = toggleMenu;
    if (btnClose) btnClose.onclick = toggleMenu;
    if (overlay) overlay.onclick = toggleMenu;
}

// Jalankan loadSidebar segera setelah struktur HTML dasar siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSidebar);
} else {
    loadSidebar();
}