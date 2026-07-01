const fs = require('fs');
let html = fs.readFileSync('d:/New folder (3)/teacher/index.html', 'utf8');

const timerHTML = `
                              <div style="padding-bottom: 20px; border-bottom: 2px solid #ECF0F1; margin-bottom: 20px;">
                                  <h4 style="margin-top:0; color:#E67E22;">⏱️ Pengaturan Waktu Kuis Belanja</h4>
                                  <p style="font-size:0.9rem; color:#7F8C8D; margin-bottom: 10px;">Atur batas waktu bagi siswa saat mengerjakan kuis belanja.</p>
                                  <div style="display: flex; gap: 15px; align-items: center;">
                                      <div style="display:flex; flex-direction:column; gap:5px;">
                                          <label for="inputKuisMenit" style="font-size:0.9rem; font-weight:bold;">Menit:</label>
                                          <input type="number" id="inputKuisMenit" min="0" max="60" value="2" style="padding:10px; border-radius:5px; border:1px solid #ccc; width:80px;">
                                      </div>
                                      <div style="display:flex; flex-direction:column; gap:5px;">
                                          <label for="inputKuisDetik" style="font-size:0.9rem; font-weight:bold;">Detik:</label>
                                          <input type="number" id="inputKuisDetik" min="0" max="59" value="0" style="padding:10px; border-radius:5px; border:1px solid #ccc; width:80px;">
                                      </div>
                                      <button id="btnSimpanWaktuKuis" class="btn btn-save" style="margin-top: 22px; background: #2ECC71; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Simpan Waktu</button>
                                  </div>
                              </div>
                              
                              <h4>Pengaturan Misi Eksplorasi (Real-time)</h4>`;

if (!html.includes('Pengaturan Waktu Kuis Belanja')) {
    html = html.replace('<h4>Pengaturan Misi Eksplorasi (Real-time)</h4>', timerHTML);
    fs.writeFileSync('d:/New folder (3)/teacher/index.html', html);
    console.log("Timer HTML injected");
} else {
    console.log("Already exists");
}
