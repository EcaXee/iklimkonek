// Konfigurasi Dasar API
const API_BASE = "https://api.open-meteo.com/v1/forecast";

/**
 * Fungsi untuk mengambil data cuaca berdasarkan koordinat dan mode
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} mode - 'petani' atau 'nelayan'
 */
async function getWeatherData(lat, lng, mode) {
    // Tentukan parameter berdasarkan kebutuhan profesi
    const params = mode === 'petani' 
        ? "current=temperature_2m,precipitation_probability" // Suhu & Hujan
        : "current=temperature_2m,wind_speed_10m";          // Suhu & Angin
    
    const url = `${API_BASE}?latitude=${lat}&longitude=${lng}&${params}&timezone=auto`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Jaringan bermasalah atau API tidak merespon");
        return await res.json();
    } catch (error) {
        console.error("Gagal mengambil data cuaca:", error);
        throw error;
    }
}