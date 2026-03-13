document.addEventListener('DOMContentLoaded', () => {
    // Coba ambil lokasi GPS pengguna secara otomatis
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => updatePetaniDashboard(pos.coords.latitude, pos.coords.longitude),
            () => updatePetaniDashboard(-8.5833, 116.1167) // Fallback ke Mataram jika GPS mati
        );
    } else {
        updatePetaniDashboard(-8.5833, 116.1167);
    }
});

async function updatePetaniDashboard(lat, lng) {
    try {
        const data = await getWeatherData(lat, lng, 'petani');
        const temp = Math.round(data.current.temperature_2m);
        const prob = data.current.precipitation_probability;

        // Update angka di UI
        document.getElementById('stat-temp').innerText = `${temp}°C`;
        document.getElementById('stat-val-right').innerText = `${prob}%`;

        // Update Kalimat Perintah dari Engine
        const insight = InsightEngine.getPetaniInsight(temp, prob);
        document.getElementById('main-status-desc').innerText = insight;

        // Update Visual (Warna & Status) jika hujan tinggi
        if (prob > 50) {
            const card = document.getElementById('status-card');
            card.classList.replace('bg-green-100', 'bg-orange-100');
            card.classList.replace('text-green-900', 'text-orange-900');
            document.getElementById('main-status-title').innerText = "WASPADA HUJAN";
            document.getElementById('status-badge').innerText = "WASPADA";
            document.getElementById('status-badge').classList.replace('bg-green-500', 'bg-orange-500');
            document.getElementById('work-status').innerText = "WASPADA";
            document.getElementById('work-card').style.borderLeftColor = "#f97316"; // Warna orange
        }
    } catch (e) {
        document.getElementById('main-status-desc').innerText = "Gagal memuat data. Periksa koneksi internet Anda.";
    }
}