const fs = require('fs');

let html = fs.readFileSync('d:/New folder (3)/student/instruksi-toko.html', 'utf8');


const kasirRegex = /<!-- Kasir \(Bottom Right\) -->[\\s\\S]*?<\/div>\\s*<\/div>/;



const oldMockUIStart = '<!-- Mock UI Elements (Hidden at first) -->';
const sceneContainerStart = '<div id="scene-container">';


let startIndex = html.indexOf(oldMockUIStart);
let endIndex = html.indexOf(sceneContainerStart);
let oldMockUI = html.substring(startIndex, endIndex);

const newMockUI = `
    <!-- Mock Kasir (Behind the speech bubble) -->
    <div id="mock-kasir-wrapper" style="opacity: 0; transition: opacity 1s ease; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none;">
        <div id="mock-kasir" style="position: absolute; bottom: -20px; right: 5%; width: 25%; max-width: 250px; display: flex; flex-direction: column; align-items: center; transition: all 0.5s ease;">
            <img src="aset student/8.png" style="width: 100%; max-height: 250px; object-fit: contain; margin-bottom: -50px; z-index: 1;">
            <div style="width: 130%; height: 180px; background: linear-gradient(to bottom, #A0522D, #8B4513); border-top: 8px solid #CD853F; border-radius: 8px 8px 0 0; position: relative; z-index: 2; display: flex; justify-content: center; align-items: flex-start; padding-top: 15px; box-shadow: 0 -5px 15px rgba(0,0,0,0.4);">
                <div style="background: #BDC3C7; border: 4px solid #7F8C8D; border-radius: 10px; padding: 10px; width: 100px; height: 80px; box-shadow: 0 5px 15px rgba(0,0,0,0.4);">
                    <div style="background: #2C3E50; width: 100%; height: 25px; border-radius: 5px;"></div>
                </div>
            </div>
            <!-- Red Cross Overlay -->
            <div id="mock-kasir-cross" style="opacity: 0; transition: opacity 0.5s ease; position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); font-size: 10rem; color: #E74C3C; text-shadow: 0 0 30px rgba(0,0,0,0.8); z-index: 4; font-weight: bold;">❌</div>
        </div>
    </div>

    <!-- Mock Rak Toko (In front of the speech bubble) -->
    <div id="mock-ui" style="opacity: 0; transition: opacity 1s ease; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 4; pointer-events: none;">
        <div id="mock-rak" style="position: absolute; top: 20px; left: 20px; background: #F1C40F; color: #B7950B; padding: 15px 25px; border-radius: 30px; font-weight: bold; font-size: 1.4rem; box-shadow: 0 4px 15px rgba(0,0,0,0.4); border: 3px solid white; transition: all 0.3s ease;">
            🛒 Pergi ke Rak Toko
        </div>
        
        <div id="mock-rak-indicator" style="opacity: 0; transition: opacity 0.5s ease; position: absolute; top: 110px; left: 60px; display: flex; flex-direction: column; align-items: center;">
            <div style="font-size: 4rem; animation: bounceIndicator 0.6s infinite alternate; filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));">⬆️</div>
        </div>
    </div>
`;

html = html.replace(oldMockUI, newMockUI + '\\n    ');
fs.writeFileSync('d:/New folder (3)/student/instruksi-toko.html', html);


let js = fs.readFileSync('d:/New folder (3)/student/js/instruksi-toko.js', 'utf8');

const jsLogicOld = `
          if (mockUI) {
              // Tampilkan UI toko di step 2 ke atas (saat masuk supermarket)
              if (index >= 2) {
                  mockUI.style.opacity = '1';
                  overlayBg.style.background = 'rgba(0, 0, 0, 0.7)'; // Gelapkan sedikit agar elemen UI lebih pop out
              } else {
                  mockUI.style.opacity = '0';
                  overlayBg.style.background = 'rgba(0, 0, 0, 0.4)';
              }
`;

const jsLogicNew = `
          const mockKasirWrapper = document.getElementById('mock-kasir-wrapper');
          if (mockUI) {
              // Tampilkan UI toko di step 2 ke atas (saat masuk supermarket)
              if (index >= 2) {
                  mockUI.style.opacity = '1';
                  if (mockKasirWrapper) mockKasirWrapper.style.opacity = '1';
                  overlayBg.style.background = 'rgba(0, 0, 0, 0.7)'; // Gelapkan sedikit agar elemen UI lebih pop out
              } else {
                  mockUI.style.opacity = '0';
                  if (mockKasirWrapper) mockKasirWrapper.style.opacity = '0';
                  overlayBg.style.background = 'rgba(0, 0, 0, 0.4)';
              }
`;

js = js.replace(jsLogicOld, jsLogicNew);
fs.writeFileSync('d:/New folder (3)/student/js/instruksi-toko.js', js);
console.log('Fixed Kasir z-index overlapping text');
