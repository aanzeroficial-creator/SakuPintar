const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/teacher/js/teacher-main.js', 'utf8');

const timerJS = `
// ==========================================
// FITUR PENGATURAN WAKTU KUIS
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    const inputKuisMenit = document.getElementById('inputKuisMenit');
    const inputKuisDetik = document.getElementById('inputKuisDetik');
    const btnSimpanWaktuKuis = document.getElementById('btnSimpanWaktuKuis');

    // Pastikan kita sudah menghubungkan dengan getSettings di firebase-db.js
    if (typeof getSettings === 'function' && inputKuisMenit) {
        try {
            const settings = await getSettings();
            let totalDetik = settings.waktuKuis || 120; // fallback 120
            
            const m = Math.floor(totalDetik / 60);
            const s = totalDetik % 60;
            
            inputKuisMenit.value = m;
            inputKuisDetik.value = s;
            
        } catch (e) {
            console.error("Gagal memuat waktu kuis", e);
        }

        btnSimpanWaktuKuis.addEventListener('click', async () => {
            const m = parseInt(inputKuisMenit.value) || 0;
            const s = parseInt(inputKuisDetik.value) || 0;
            const totalDetik = (m * 60) + s;
            
            if (totalDetik < 10) {
                alert("Waktu terlalu singkat! Minimal 10 detik.");
                return;
            }

            const originalText = btnSimpanWaktuKuis.textContent;
            btnSimpanWaktuKuis.textContent = "Menyimpan...";
            btnSimpanWaktuKuis.disabled = true;

            await updateWaktuKuis(totalDetik);
            
            btnSimpanWaktuKuis.textContent = "Tersimpan!";
            setTimeout(() => {
                btnSimpanWaktuKuis.textContent = originalText;
                btnSimpanWaktuKuis.disabled = false;
            }, 2000);
        });
    }
});
`;

if (!js.includes('FITUR PENGATURAN WAKTU KUIS')) {
    js = js + '\n' + timerJS;
    fs.writeFileSync('d:/New folder (3)/teacher/js/teacher-main.js', js);
    console.log("Timer JS injected");
} else {
    console.log("Timer JS already exists");
}
