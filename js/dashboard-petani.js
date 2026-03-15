const DEFAULT_LAT = -8.5833;
const DEFAULT_LNG = 116.1167;

// Saat halaman siap, ambil GPS pengguna. Jika gagal, fallback ke Mataram.
document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => updatePetaniDashboard(pos.coords.latitude, pos.coords.longitude),
            () => updatePetaniDashboard(DEFAULT_LAT, DEFAULT_LNG)
        );
        return;
    }

    updatePetaniDashboard(DEFAULT_LAT, DEFAULT_LNG);
});

async function updatePetaniDashboard(lat, lng) {
    try {
        const data = await getWeatherData(lat, lng, "petani");
        const temp = Math.round(data.current.temperature_2m);
        const prob = data.current.precipitation_probability;

        // 1) Update metrik utama.
        document.getElementById('stat-temp').innerText = `${temp}°C`;
        document.getElementById('stat-val-right').innerText = `${prob}%`;

        // 2) Ambil insight dari rule engine.
        const insight = InsightEngine.getPetaniInsight(temp, prob);
        document.getElementById('main-status-desc').innerText = insight;

        // 3) Ubah status visual saat peluang hujan tinggi.
        if (prob > 50) {
            const card = document.getElementById('status-card');
            card.classList.replace('bg-green-100', 'bg-orange-100');
            card.classList.replace('text-green-900', 'text-orange-900');
            document.getElementById('main-status-title').innerText = "WASPADA HUJAN";
            document.getElementById('status-badge').innerText = "WASPADA";
            document.getElementById('status-badge').classList.replace('bg-green-500', 'bg-orange-500');
            document.getElementById('work-status').innerText = "WASPADA";
            document.getElementById('work-card').style.borderLeftColor = "#f97316";
        }
    } catch (e) {
        // Pesan fallback agar UI tetap informatif saat API gagal.
        document.getElementById('main-status-desc').innerText = "Gagal memuat data. Periksa koneksi internet Anda.";
    }
}