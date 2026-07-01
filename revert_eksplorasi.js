const fs = require('fs');


let eksplorasiJs = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');


const targetVnBlock = `                // Menampilkan hasil animasi setelah delay
                setTimeout(() => {
                    infoGacha.style.display = 'none';
                    document.getElementById('sectionCerita').style.display = 'none';
                    
                    // Mulai Visual Novel
                    startVisualNovel(teksMisi, uangSakuMisi, fotosMisi, currentStorySettings ? currentStorySettings.aturan : "Tidak ada aturan khusus.");
                    
                    if (hasil && hasil.baruSajaDiundi) {
                        // Tetap play SFX agar lebih meriah
                        const sfxWin = new Audio('../benar.mp3');
                        sfxWin.play().catch(e=>{});
                    }
                    
                    // Selalu jalankan partikel setiap putaran selesai agar meriah!
                    if (typeof createParticles === 'function') {
                        createParticles();
                    }
                }, 12000); // 12 detik sesuai durasi total animasi pita`;

const restoredBlock = `                // Menampilkan hasil animasi setelah delay
                setTimeout(() => {
                    infoGacha.style.display = 'none';
                    document.getElementById('hasilCeritaArea').style.display = 'block';
                    
                    if (hasil && hasil.baruSajaDiundi) {
                        // Play SFX Kemenangan
                        const sfxWin = new Audio('../benar.mp3');
                        sfxWin.play().catch(e=>{});
                    }
                    
                    // Jalankan partikel
                    if (typeof createParticles === 'function') {
                        createParticles();
                    }
                }, 12000); // 12 detik sesuai durasi total animasi pita`;

if (eksplorasiJs.includes("document.getElementById('sectionCerita').style.display = 'none';")) {
    eksplorasiJs = eksplorasiJs.replace(targetVnBlock, restoredBlock);
}


eksplorasiJs = eksplorasiJs.replace(/\/\/ ==========================================\s*\/\/\s*VISUAL NOVEL ENGINE UNTUK EKSPLORASI\s*\/\/\s*==========================================\s*function startVisualNovel[\s\S]*/, "");

fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', eksplorasiJs);
console.log("eksplorasi.js reverted.");


let eksplorasiHtml = fs.readFileSync('d:/New folder (3)/student/eksplorasi.html', 'utf8');


eksplorasiHtml = eksplorasiHtml.replace(/<!-- VISUAL NOVEL CONTAINER \(Ditampilkan setelah Gacha\) -->\s*<div id="vn-container"[^>]*>[\s\S]*?<div id="vn-click-layer"><\/div>\s*<\/div>/, "");


eksplorasiHtml = eksplorasiHtml.replace(/\/\*\s*---\s*VISUAL NOVEL UI\s*---\s*\*\/[\s\S]*?\}\s*<\/style>/, "</style>");

fs.writeFileSync('d:/New folder (3)/student/eksplorasi.html', eksplorasiHtml);
console.log("eksplorasi.html reverted.");
