const fs = require('fs');

let code = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');


let targetEndStr = `                pilihKelompokArea.style.display = 'none';
                hasilCeritaArea.style.display = 'block';
                
                // KITA HAPUS TRANSISI LAMBAT/DELAY SAAT KARTU MUNCUL
                hasilCeritaArea.classList.remove('stumble-transition');
                
                const sfxWin = new Audio('../benar.mp3');
                sfxWin.play().catch(e=>{});

                if (typeof createParticles === 'function') {
                    createParticles();
                }
            }, 12000); // Tunggu sampai putaran selesai (11.5s) lalu langsung munculkan hasil
        });
    }
});`;

let replacementEndStr = `                // Sembunyikan area pilih kelompok, tampilkan hasil
                pilihKelompokArea.style.display = 'none';
                hasilCeritaArea.style.display = 'block';
                hasilCeritaArea.classList.add('stumble-transition'); // Tambahkan efek transisi membulat
                
                if (hasil && hasil.baruSajaDiundi) {
                    // Tetap play SFX agar lebih meriah
                    const sfxWin = new Audio('../benar.mp3');
                    sfxWin.play().catch(e=>{});
                }
            }, 12000); // 11.5s animasi + 0.5s jeda dramatis
        });
    }
});`;

if(code.includes(targetEndStr)) {
    code = code.replace(targetEndStr, replacementEndStr);
} else {
    
    console.log("Could not find the exact string. Will try to truncate.");
    let idx = code.indexOf("hasilCeritaArea.style.display = 'block';");
    if(idx !== -1) {
        let beforeBlock = code.substring(0, idx);
        code = beforeBlock + replacementEndStr;
    }
}


let createParticlesIdx = code.indexOf("function createParticles()");
if (createParticlesIdx !== -1) {
    code = code.substring(0, createParticlesIdx).trim() + "\\n";
}

fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', code);
console.log("Reverted to original.");
