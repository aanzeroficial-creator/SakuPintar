const fs = require('fs');
let code = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');


let startIdx = code.indexOf("// --- ANIMASI ROULETTE ---");
let endIdx = code.indexOf("});\\n});");
if (endIdx === -1) endIdx = code.indexOf("});\\r\\n});");
if (endIdx === -1) endIdx = code.lastIndexOf("});");

const newLogic = `
            // --- TAMPILKAN MISI LANGSUNG (TANPA DELAY) ---
            if(rouletteContainer) rouletteContainer.style.display = 'none';

            const fotoCeritaArea = document.getElementById('fotoCeritaArea');
            if (fotoCeritaArea) {
                fotoCeritaArea.innerHTML = '';
                if (fotosMisi.length > 0) {
                    fotosMisi.forEach(base64 => {
                        fotoCeritaArea.innerHTML += \`<img src="\${base64}" style="width:100%; height:auto; border-radius:10px; border:2px solid #00FFFF; box-shadow:0 0 15px rgba(0,255,255,0.5);">\`;
                    });
                    fotoCeritaArea.style.display = 'grid';
                } else {
                    fotoCeritaArea.style.display = 'none';
                }
            }

            const teksCerita = document.getElementById('teksCerita');
            if(teksCerita) teksCerita.textContent = teksMisi;
            
            const infoUangSakuMisi = document.getElementById('infoUangSakuMisi');
            if(infoUangSakuMisi && typeof formatRupiah === 'function') {
                infoUangSakuMisi.textContent = formatRupiah(uangSakuMisi);
            } else if (infoUangSakuMisi) {
                infoUangSakuMisi.textContent = "Rp " + uangSakuMisi.toLocaleString('id-ID');
            }

            pilihKelompokArea.style.display = 'none';
            hasilCeritaArea.style.display = 'block';
            hasilCeritaArea.classList.remove('stumble-transition');
            
            const sfxWin = new Audio('../benar.mp3');
            sfxWin.play().catch(e=>{});

            if (typeof createParticles === 'function') {
                createParticles();
            }
        });
    }
});

function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.zIndex = '999999';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'][Math.floor(Math.random() * 6)];
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.boxShadow = '0 0 10px ' + particle.style.background;
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: \`translate(\${tx}px, \${ty}px) scale(0)\`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => particle.remove();
    }
}
`;

code = code.substring(0, startIdx) + newLogic;
fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', code);
console.log('Fixed explicitly!');
