const DEFAULT_LAT = -8.5833;
const DEFAULT_LNG = 116.1167;

// Saat halaman siap, ambil GPS pengguna. Jika gagal, fallback ke Mataram.
document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => updateNelayanDashboard(pos.coords.latitude, pos.coords.longitude),
            () => updateNelayanDashboard(DEFAULT_LAT, DEFAULT_LNG)
        );
        return;
    }

    updateNelayanDashboard(DEFAULT_LAT, DEFAULT_LNG);
});

async function updateNelayanDashboard(lat, lng) {
    try {
        const data = await getWeatherData(lat, lng, "nelayan");
        const temp = Math.round(data.current.temperature_2m);
        const wind = data.current.wind_speed_10m;

        // 1) Update metrik utama.
        document.getElementById('stat-temp').innerText = `${temp}°C`;
        document.getElementById('stat-val-right').innerText = `${wind} km/j`;

        // 2) Ambil insight dari rule engine.
        const insight = InsightEngine.getNelayanInsight(wind);
        document.getElementById('main-status-desc').innerText = insight;

        // 3) Ubah status visual saat angin kencang.
        if (wind > 20) {
            const card = document.getElementById('status-card');
            card.classList.replace('bg-blue-100', 'bg-red-100');
            card.classList.replace('text-blue-900', 'text-red-900');
            document.getElementById('main-status-title').innerText = "BAHAYA ANGIN";
            document.getElementById('status-badge').innerText = "BAHAYA";
            document.getElementById('status-badge').classList.replace('bg-blue-500', 'bg-red-500');
            document.getElementById('work-status').innerText = "BAHAYA";
            document.getElementById('work-card').style.borderLeftColor = "#ef4444";
        }
    } catch (e) {
        // Pesan fallback agar UI tetap informatif saat API gagal.
        document.getElementById('main-status-desc').innerText = "Gagal memuat data laut.";
    }
}