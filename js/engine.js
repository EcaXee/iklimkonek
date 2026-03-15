/**
 * Rule engine sederhana untuk mengubah angka cuaca menjadi instruksi aksi.
 * Semua ambang batas disimpan di sini agar mudah diubah di satu tempat.
 */
const InsightEngine = {
    /**
     * Insight khusus petani berdasarkan suhu dan peluang hujan.
     * @param {number} temp
     * @param {number} rainProb
     * @returns {string}
     */
    getPetaniInsight: (temp, rainProb) => {
        if (rainProb > 70) {
            return "Tunda pemupukan pagi ini. Peluang hujan sangat tinggi, pupuk akan hanyut terbawa air.";
        } else if (rainProb > 30) {
            return "Waspada hujan ringan. Pastikan saluran drainase lancar untuk mencegah genangan di lahan.";
        } else if (temp > 32) {
            return "Suhu udara panas. Lakukan penyiraman ekstra pada sore hari untuk menjaga kelembapan tanaman.";
        } else {
            return "Kondisi ideal. Waktu yang tepat untuk melakukan pemeliharaan rutin atau penanaman.";
        }
    },

    /**
     * Insight khusus nelayan berdasarkan kecepatan angin.
     * @param {number} windSpeed
     * @returns {string}
     */
    getNelayanInsight: (windSpeed) => {
        if (windSpeed > 25) {
            return "DILARANG MELAUT. Angin kencang berisiko menimbulkan gelombang tinggi. Utamakan keselamatan.";
        } else if (windSpeed > 15) {
            return "Waspada saat melaut. Angin cukup kencang, hindari area perairan terbuka yang jauh dari pantai.";
        } else {
            return "Laut sangat tenang. Kondisi sempurna untuk mencari ikan hingga ke tengah laut.";
        }
    }
};