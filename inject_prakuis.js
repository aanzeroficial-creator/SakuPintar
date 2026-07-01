const fs = require('fs');

let html = fs.readFileSync('d:/New folder (3)/student/kuis-belanja.html', 'utf8');


html = html.replace('<div class="dompet-container" style="background: transparent; border: none; box-shadow: none; padding: 0; position: relative; display: inline-block;">', '<div id="panelDompet" class="dompet-container" style="background: transparent; border: none; box-shadow: none; padding: 0; position: relative; display: none; opacity: 0; transform: scale(0.8); transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">');


const panelPilihBarang = `
            <!-- PANEL PRA-KUIS: Pergi ke Rak Toko -->
            <div id="panelPilihBarang" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100%; animation: floatPanel 3s ease-in-out infinite;">
                <div id="btnRaksasaRak" style="background: linear-gradient(135deg, #F1C40F, #F39C12); color: white; padding: 30px 40px; border-radius: 30px; border: 8px solid white; box-shadow: 0 15px 35px rgba(241,196,15,0.6); text-align: center; cursor: pointer; transition: all 0.3s ease;">
                    <div style="font-size: 5rem; margin-bottom: 10px; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.2));">🛒</div>
                    <div style="font-size: 2.2rem; font-weight: 900; text-transform: uppercase; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">Masuk ke<br>Rak Toko</div>
                </div>
                <style>
                    @keyframes floatPanel {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-15px); }
                    }
                    #btnRaksasaRak:hover {
                        transform: scale(1.05);
                        box-shadow: 0 20px 45px rgba(241,196,15,0.8);
                    }
                    #btnRaksasaRak:active {
                        transform: scale(0.95);
                    }
                </style>
            </div>
`;

html = html.replace('<!-- Kontainer Dompet dengan Aset Gambar -->', panelPilihBarang + '\\n            <!-- Kontainer Dompet dengan Aset Gambar -->');

fs.writeFileSync('d:/New folder (3)/student/kuis-belanja.html', html);
console.log('Modified HTML');
