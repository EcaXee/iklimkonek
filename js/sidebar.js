/**
 * Memuat komponen sidebar dari file terpisah agar bisa dipakai lintas halaman.
 */
async function loadSidebar() {
    try {
        // 1) Ambil template HTML sidebar.
        const response = await fetch('components/sidebar.html');
        
        if (!response.ok) {
            throw new Error(`Gagal memuat sidebar. Status: ${response.status}`);
        }

        const sidebarHTML = await response.text();

        // 2) Sisipkan di akhir body supaya struktur halaman utama tetap aman.
        document.body.insertAdjacentHTML('beforeend', sidebarHTML);

        // 3) Pasang event interaksi setelah elemen sidebar tersedia.
        initSidebarLogic();

    } catch (error) {
        console.error("Error Sidebar:", error);
    }
}

/**
 * Menyiapkan perilaku buka/tutup sidebar.
 */
function initSidebarLogic() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btnOpen = document.getElementById('btn-menu');
    const btnClose = document.getElementById('close-sidebar');

    // Satu fungsi toggle untuk semua trigger (open, close, klik overlay).
    const toggleMenu = () => {
        if (sidebar && overlay) {
            sidebar.classList.toggle('translate-x-full');
            overlay.classList.toggle('hidden');
            // Kunci scroll body saat sidebar aktif.
            document.body.classList.toggle('overflow-hidden');
        }
    };

    // Pasang event hanya jika elemennya tersedia di halaman saat ini.
    if (btnOpen) btnOpen.onclick = toggleMenu;
    if (btnClose) btnClose.onclick = toggleMenu;
    if (overlay) overlay.onclick = toggleMenu;
}

// Jalankan segera setelah DOM siap.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSidebar);
} else {
    loadSidebar();
}