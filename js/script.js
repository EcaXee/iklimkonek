// Koordinat fallback jika GPS tidak tersedia.
const DEFAULT_LAT = -8.5833; 
const DEFAULT_LNG = 116.1167;
let currentMode = 'petani';

// Rule engine sederhana untuk mengubah data cuaca menjadi rekomendasi aksi.
const InsightEngine = {
    getPetaniInsight: (temp, rainProb) => {
        if (rainProb > 70) return "Tunda pemupukan pagi ini. Peluang hujan sangat tinggi, pupuk akan hanyut terbawa air.";
        if (rainProb > 30) return "Waspada hujan ringan. Pastikan saluran drainase lancar untuk mencegah genangan.";
        if (temp > 32) return "Suhu udara sangat panas. Lakukan penyiraman ekstra sore nanti untuk menjaga tanaman.";
        return "Kondisi ideal. Waktu yang tepat untuk pemeliharaan rutin atau penanaman.";
    },
    getNelayanInsight: (windSpeed) => {
        if (windSpeed > 25) return "DILARANG MELAUT. Angin kencang berisiko gelombang tinggi. Utamakan keselamatan.";
        if (windSpeed > 15) return "Waspada saat melaut. Angin cukup kencang, hindari perairan terbuka jauh dari pantai.";
        return "Laut sangat tenang. Kondisi sempurna untuk mencari ikan hingga ke tengah laut.";
    }
};

const contentData = {
    petani: {
        theme: 'bg-green-100 text-green-900 border-green-200',
        badge: 'bg-green-500', icon: '☀️', labelRight: 'Peluang Hujan',
        targetLabel: 'REKOMENDASI TANAMAN',
        tags: ['Padi', 'Jagung', 'Bayam', 'Kangkung'],
        season: { title: 'Musim Penghujan', desc: 'Curah hujan tinggi dengan kelembapan tanah maksimal.', icon: '🌧️', bg: 'bg-green-200', tips: 'Buat bedengan lebih tinggi untuk mencegah akar busuk.' }
    },
    nelayan: {
        theme: 'bg-blue-100 text-blue-900 border-blue-200',
        badge: 'bg-blue-500', icon: '🌊', labelRight: 'Kec. Angin',
        targetLabel: 'TARGET TANGKAPAN UTAMA',
        tags: ['Cumi-cumi', 'Ikan Karang', 'Kakap'],
        season: { title: 'Musim Peralihan', desc: 'Arah angin sering berubah, waspada potensi badai lokal tiba-tiba.', icon: '🌪️', bg: 'bg-blue-200', tips: 'Waspada perubahan cuaca mendadak saat di tengah laut.' }
    }
};

// Titik masuk utama: ambil lokasi lalu fetch cuaca sesuai mode.
async function startApp() {
    // Coba gunakan GPS pengguna.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => fetchData(pos.coords.latitude, pos.coords.longitude),
            () => fetchData(DEFAULT_LAT, DEFAULT_LNG) // Fallback jika GPS ditolak
        );
    } else {
        fetchData(DEFAULT_LAT, DEFAULT_LNG);
    }
}

async function fetchData(lat, lng) {
    try {
        const isPetani = currentMode === 'petani';
        const url = isPetani 
            ? `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation_probability&timezone=auto`
            : `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m&timezone=auto`;

        const res = await fetch(url);
        const data = await res.json();
        
        const temp = Math.round(data.current.temperature_2m);
        document.getElementById('stat-temp').innerText = `${temp}°C`;

        let insight, title, color;

        if (isPetani) {
            const prob = data.current.precipitation_probability;
            document.getElementById('stat-val-right').innerText = `${prob}%`;
            insight = InsightEngine.getPetaniInsight(temp, prob);
            title = prob > 50 ? "WASPADA" : "AMAN";
            color = prob > 50 ? "#f97316" : "#22c55e";
        } else {
            const wind = data.current.wind_speed_10m;
            document.getElementById('stat-val-right').innerText = `${wind} km/j`;
            insight = InsightEngine.getNelayanInsight(wind);
            title = wind > 20 ? "BAHAYA" : "SANGAT AMAN";
            color = wind > 20 ? "#ef4444" : "#3b82f6";
        }

        // Update UI utama berdasarkan hasil perhitungan status.
        document.getElementById('main-status-title').innerText = title;
        document.getElementById('main-status-desc').innerText = insight;
        document.getElementById('work-status').innerText = title;
        document.getElementById('work-card').style.borderLeftColor = color;
        document.getElementById('status-badge').innerText = title;

    } catch (e) {
        console.error("Gagal memuat data API", e);
    }
}

function renderUI() {
    // Render elemen statis sesuai mode (petani/nelayan).
    const d = contentData[currentMode];
    document.getElementById('toggle-text').innerText = currentMode === 'petani' ? 'Petani' : 'Nelayan';
    document.getElementById('toggle-icon').innerText = currentMode === 'petani' ? '🌾' : '🌊';
    document.getElementById('status-card').className = `p-6 rounded-3xl relative overflow-hidden transition-all duration-500 ${d.theme}`;
    document.getElementById('status-badge').className = `absolute top-4 right-4 px-4 py-1 rounded-full text-[10px] font-black text-white uppercase ${d.badge}`;
    document.getElementById('main-icon').innerText = d.icon;
    document.getElementById('season-icon-bg').className = `w-12 h-12 rounded-full flex items-center justify-center ${d.season.bg}`;
    document.getElementById('season-icon').innerText = d.season.icon;
    document.getElementById('season-title').innerText = d.season.title;
    document.getElementById('season-desc').innerText = d.season.desc;
    document.getElementById('stat-label-right').innerText = d.labelRight;
    document.getElementById('target-label').innerText = d.targetLabel;
    document.getElementById('target-list').innerHTML = d.tags.map(t => `<span class="px-4 py-1.5 rounded-full text-[10px] font-bold ${currentMode === 'petani' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}">${t}</span>`).join('');
}

document.getElementById('mode-toggle').addEventListener('click', () => {
    // Toggle mode lalu refresh data agar rekomendasi ikut berubah.
    currentMode = currentMode === 'petani' ? 'nelayan' : 'petani';
    renderUI();
    startApp();
});

document.addEventListener('DOMContentLoaded', () => {
    renderUI();
    startApp();
});