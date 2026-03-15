// Endpoint utama Open-Meteo untuk data cuaca terkini.
const API_BASE = "https://api.open-meteo.com/v1/forecast";

/**
 * Mengambil data cuaca berdasarkan koordinat dan mode pengguna.
 * @param {number} lat Latitude lokasi.
 * @param {number} lng Longitude lokasi.
 * @param {'petani'|'nelayan'} mode Menentukan metrik cuaca yang diambil.
 * @returns {Promise<any>} Payload JSON dari Open-Meteo.
 */
async function getWeatherData(lat, lng, mode) {
    // Petani butuh peluang hujan, nelayan butuh kecepatan angin.
    const params =
        mode === "petani"
            ? "current=temperature_2m,precipitation_probability"
            : "current=temperature_2m,wind_speed_10m";

    const url = `${API_BASE}?latitude=${lat}&longitude=${lng}&${params}&timezone=auto`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Jaringan bermasalah atau API tidak merespon");
        }

        return await res.json();
    } catch (error) {
        console.error("Gagal mengambil data cuaca:", error);
        throw error;
    }
}