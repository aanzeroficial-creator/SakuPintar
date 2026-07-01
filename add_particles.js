const fs = require('fs');

let code = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');

let targetCode = `                // Sembunyikan area pilih kelompok, tampilkan hasil
                pilihKelompokArea.style.display = 'none';
                hasilCeritaArea.style.display = 'block';
                hasilCeritaArea.classList.add('stumble-transition'); // Tambahkan efek transisi membulat
                
                if (hasil && hasil.baruSajaDiundi) {
                    // Tetap play SFX agar lebih meriah
                    const sfxWin = new Audio('../benar.mp3');
                    sfxWin.play().catch(e=>{});
                }
            }, 12000); // 11.5s animasi + 0.1s jeda dramatis`;

let replaceCode = `                // Sembunyikan area pilih kelompok, tampilkan hasil
                pilihKelompokArea.style.display = 'none';
                hasilCeritaArea.style.display = 'block';
                
                // Hilangkan delay membesar (transisi) saat cerita muncul
                hasilCeritaArea.classList.remove('stumble-transition');
                
                if (hasil && hasil.baruSajaDiundi) {
                    // Tetap play SFX agar lebih meriah
                    const sfxWin = new Audio('../benar.mp3');
                    sfxWin.play().catch(e=>{});
                    
                    if (typeof createParticles === 'function') {
                        createParticles();
                    }
                }
            }, 12000); // 11.5s animasi + 0.1s jeda dramatis`;

if (code.includes(targetCode)) {
    code = code.replace(targetCode, replaceCode);
} else {
    console.log("Could not find the target code to replace!");
}

let particlesFunc = `

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
            { transform: \\\`translate(\${tx}px, \${ty}px) scale(0)\\\`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => particle.remove();
    }
}
`;

if (!code.includes("function createParticles()")) {
    code += particlesFunc;
}

fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', code);
console.log("Applied changes successfully!");
