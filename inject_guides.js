const fs = require('fs');

let html = fs.readFileSync('d:/New folder (3)/student/instruksi-toko.html', 'utf8');

const mockUI = `
    <!-- Mock UI Elements (Hidden at first) -->
    <div id="mock-ui" style="opacity: 0; transition: opacity 1s ease; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; pointer-events: none;">
        <!-- Rak Toko Button (Top Right) -->
        <div id="mock-rak" style="position: absolute; top: 20px; right: 20px; background: #F1C40F; color: #B7950B; padding: 15px 25px; border-radius: 30px; font-weight: bold; font-size: 1.4rem; box-shadow: 0 4px 15px rgba(0,0,0,0.4); border: 3px solid white; transition: all 0.3s ease;">
            🛒 Pergi ke Rak Toko
        </div>
        
        <!-- Indicator Arrow -->
        <div id="mock-rak-indicator" style="opacity: 0; transition: opacity 0.5s ease; position: absolute; top: 80px; right: 60px; display: flex; flex-direction: column; align-items: center;">
            <div style="font-size: 4rem; animation: bounceIndicator 0.6s infinite alternate; filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));">⬆️</div>
            <div style="background: #E74C3C; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 800; font-size: 1.2rem; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); margin-top: 10px; animation: pulseRed 1s infinite alternate;">FOKUS KE SINI!</div>
        </div>

        <!-- Kasir (Bottom Right) -->
        <div id="mock-kasir" style="position: absolute; bottom: -20px; right: 5%; width: 25%; max-width: 250px; display: flex; flex-direction: column; align-items: center; transition: all 0.5s ease;">
            <img src="aset student/8.png" style="width: 100%; max-height: 250px; object-fit: contain; margin-bottom: -50px; z-index: 1;">
            <div style="width: 130%; height: 180px; background: linear-gradient(to bottom, #A0522D, #8B4513); border-top: 8px solid #CD853F; border-radius: 8px 8px 0 0; position: relative; z-index: 2; display: flex; justify-content: center; align-items: flex-start; padding-top: 15px; box-shadow: 0 -5px 15px rgba(0,0,0,0.4);">
                <div style="background: #BDC3C7; border: 4px solid #7F8C8D; border-radius: 10px; padding: 10px; width: 100px; height: 80px; box-shadow: 0 5px 15px rgba(0,0,0,0.4);">
                    <div style="background: #2C3E50; width: 100%; height: 25px; border-radius: 5px;"></div>
                </div>
            </div>
            <!-- Red Cross Overlay (Hidden initially) -->
            <div id="mock-kasir-cross" style="opacity: 0; transition: opacity 0.5s ease; position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); font-size: 10rem; color: #E74C3C; text-shadow: 0 0 30px rgba(0,0,0,0.8); z-index: 4; font-weight: bold;">❌</div>
        </div>
    </div>
`;


html = html.replace('<div id="scene-container">', mockUI + '\\n    <div id="scene-container">');


const cssAnimations = `
        @keyframes bounceIndicator {
            from { transform: translateY(0); }
            to { transform: translateY(-20px); }
        }
        @keyframes pulseRed {
            from { transform: scale(1); box-shadow: 0 0 10px #E74C3C; }
            to { transform: scale(1.1); box-shadow: 0 0 30px #E74C3C; }
        }
`;
html = html.replace('</style>', cssAnimations + '\\n    </style>');

fs.writeFileSync('d:/New folder (3)/student/instruksi-toko.html', html);



let js = fs.readFileSync('d:/New folder (3)/student/js/instruksi-toko.js', 'utf8');


const logic = `
        // --- LOGIKA MOCK UI ---
        const mockUI = document.getElementById('mock-ui');
        const mockRak = document.getElementById('mock-rak');
        const mockRakInd = document.getElementById('mock-rak-indicator');
        const mockKasir = document.getElementById('mock-kasir');
        const mockKasirCross = document.getElementById('mock-kasir-cross');
        const overlayBg = document.querySelector('.overlay-bg');
        
        if (mockUI) {
            // Tampilkan UI toko di step 2 ke atas (saat masuk supermarket)
            if (index >= 2) {
                mockUI.style.opacity = '1';
                overlayBg.style.background = 'rgba(0, 0, 0, 0.7)'; // Gelapkan sedikit agar elemen UI lebih pop out
            } else {
                mockUI.style.opacity = '0';
                overlayBg.style.background = 'rgba(0, 0, 0, 0.4)';
            }

            // Highlight Rak dan Larang Kasir di step 3
            if (index === 3) {
                mockRak.style.transform = 'scale(1.2)';
                mockRak.style.boxShadow = '0 0 30px #F1C40F';
                mockRakInd.style.opacity = '1';
                
                mockKasir.style.filter = 'grayscale(100%) brightness(50%)';
                mockKasirCross.style.opacity = '1';
            } else {
                mockRak.style.transform = 'scale(1)';
                mockRak.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
                mockRakInd.style.opacity = '0';
                
                mockKasir.style.filter = 'none';
                mockKasirCross.style.opacity = '0';
            }
        }
`;


js = js.replace('gameBg.style.backgroundImage = scene.bg;', 'gameBg.style.backgroundImage = scene.bg;\\n' + logic);

fs.writeFileSync('d:/New folder (3)/student/js/instruksi-toko.js', js);
console.log("Successfully added visual guides.");
