const fs = require('fs');

let html = fs.readFileSync('d:/New folder (3)/student/kuis-belanja.html', 'utf8');

const panelAI = `
    <!-- PANEL EVALUASI AI & GATEKEEPER -->
    <div id="panelEvaluasiAI" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(44,62,80,0.95); z-index: 10000; flex-direction: column; align-items: center; justify-content: center; overflow-y: auto; padding: 20px;">
        
        <div style="background: white; border-radius: 20px; width: 90%; max-width: 800px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; position: relative;">
            <h2 style="color: #2C3E50; font-size: 2.5rem; margin-bottom: 10px; text-transform: uppercase;">🤖 Evaluasi AI Cerdas</h2>
            <p style="color: #7F8C8D; font-size: 1.2rem; margin-bottom: 20px;">Menganalisis keputusan belanjamu berdasarkan Misi Cerita...</p>
            
            <!-- Loading Indicator AI -->
            <div id="aiLoading" style="display: flex; flex-direction: column; align-items: center; margin: 30px 0;">
                <div style="font-size: 4rem; animation: spin 2s linear infinite;">⚙️</div>
                <p style="margin-top: 15px; font-weight: bold; color: #E67E22;">AI sedang berpikir...</p>
            </div>
            
            <!-- Hasil AI -->
            <div id="aiResult" style="display: none; width: 100%;">
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background: #34495E; color: white;">
                            <th style="padding: 15px; border: 1px solid #BDC3C7;">Barang</th>
                            <th style="padding: 15px; border: 1px solid #BDC3C7;">Kategori</th>
                            <th style="padding: 15px; border: 1px solid #BDC3C7;">Alasan AI</th>
                        </tr>
                    </thead>
                    <tbody id="aiTabelBody">
                        <!-- Diisi via JS -->
                    </tbody>
                </table>
            </div>

            <!-- Area Status Izin Guru -->
            <div id="statusIzinArea" style="background: #ECF0F1; padding: 20px; border-radius: 15px; margin-top: 30px; display: none;">
                <div id="statusIzinIcon" style="font-size: 3rem; margin-bottom: 10px;">⏳</div>
                <h3 id="statusIzinTitle" style="color: #E67E22; margin-bottom: 5px;">Menunggu Izin Guru</h3>
                <p id="statusIzinText" style="color: #7F8C8D; margin-bottom: 15px;">Guru sedang mengecek laporanmu di Dashboard. Mohon tunggu sebentar ya!</p>
                <button id="btnLanjutMisi" disabled style="background: #BDC3C7; color: white; padding: 15px 40px; font-size: 1.2rem; font-weight: bold; border: none; border-radius: 10px; cursor: not-allowed; transition: all 0.3s ease;">Lanjut ke Peta 🚀</button>
            </div>
        </div>

        <style>
            @keyframes spin { 100% { transform: rotate(360deg); } }
            .kategori-kebutuhan { background: #27AE60; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold; }
            .kategori-keinginan { background: #E74C3C; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold; }
            .btn-lanjut-aktif { background: #2ECC71 !important; cursor: pointer !important; box-shadow: 0 5px 15px rgba(46,204,113,0.5); }
            .btn-lanjut-aktif:hover { transform: scale(1.05); }
        </style>
    </div>
`;

if (!html.includes('id="panelEvaluasiAI"')) {
    html = html.replace('</body>', panelAI + '\\n</body>');
    fs.writeFileSync('d:/New folder (3)/student/kuis-belanja.html', html);
    console.log("Injected AI Panel into HTML");
} else {
    console.log("AI Panel already exists.");
}

