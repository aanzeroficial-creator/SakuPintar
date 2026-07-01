const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');


const oldBlock = `
                // Sembunyikan area pilih kelompok, tapi JANGAN tampilkan hasilCeritaArea lama
                // pilihKelompokArea.style.display = 'none'; // Tetap sembunyikan
                // hasilCeritaArea.style.display = 'block';
                
                // Sembunyikan seluruh sectionCerita (kotak putih)
                document.getElementById('sectionCerita').style.display = 'none';
                
                // Mulai Visual Novel
                startVisualNovel(teksMisi, uangSakuMisi, fotosMisi, currentStorySettings ? currentStorySettings.aturan : "Tidak ada aturan khusus.");
`;

const newBlock = `
                // Tampilkan hasil cerita
                pilihKelompokArea.style.display = 'none';
                hasilCeritaArea.style.display = 'block';
                document.getElementById('sectionCerita').style.display = 'block';
`;

js = js.replace(oldBlock, newBlock);


const oldBlock2 = `
                // Sembunyikan area pilih kelompok, tapi JANGAN tampilkan hasilCeritaArea lama
                // pilihKelompokArea.style.display = 'none'; // Tetap sembunyikan
                // hasilCeritaArea.style.display = 'block';
                
                // Sembunyikan seluruh sectionCerita (kotak putih)
                document.getElementById('sectionCerita').style.display = 'none';
                
                // Mulai Visual Novel
                if(typeof startVisualNovel === 'function') {
                     startVisualNovel(teksMisi, uangSakuMisi, fotosMisi, currentStorySettings ? currentStorySettings.aturan : "Tidak ada aturan khusus.");
                }
`;

js = js.replace(oldBlock2, newBlock);


js = js.replace(/\\/\\/\\s*Sembunyikan area pilih kelompok[\\s\\S]*?\\/\\/\\s*Mulai Visual Novel[\\s\\S]*?\\);/g, newBlock);





const marker = "}).onfinish = () => particle.remove();\\n    }\\n}";
const markerIndex = js.lastIndexOf(marker);
if (markerIndex !== -1) {
    js = js.substring(0, markerIndex + marker.length) + '\\n';
}

fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', js);
console.log("Completely fixed JS");
