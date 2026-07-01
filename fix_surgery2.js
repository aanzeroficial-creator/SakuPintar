const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');

const firstIndex = js.indexOf("Proyek Web Edukasi");
const secondIndex = js.indexOf("Proyek Web Edukasi", firstIndex + 1);

if (secondIndex !== -1) {
    
    
    const corruptStart = js.lastIndexOf('/*', secondIndex);
    
    const part2Start = js.indexOf("// Simpan uang saku dan gender spesifik ke localStorage", corruptStart);
    
    if (part2Start !== -1) {
        let properLogic = `
            const rouletteTrack = document.getElementById('rouletteTrack');
            rouletteContainer.style.display = 'block';

            // Tarik undian cerita dari Firebase
            const hasil = await drawRandomStory(kelompokId);
            
            let teksMisi = "";
            let uangSakuMisi = 20000;
            let genderMisi = "L";
            let fotosMisi = [];

            if (!hasil || !hasil.cerita) {
                teksMisi = "Guru belum memberikan Misi Misteri. Tanyakan pada gurumu ya!";
            } else if (typeof hasil.cerita === 'object' && hasil.cerita !== null) {
                teksMisi = hasil.cerita.teks || "Teks cerita kosong.";
                uangSakuMisi = parseInt(hasil.cerita.uangSaku) || 20000;
                genderMisi = hasil.cerita.gender || "L";
                fotosMisi = hasil.cerita.fotos || [];
            } else {
                teksMisi = hasil.cerita || "Teks cerita kosong.";
            }

            `;
            
        let finalJS = js.substring(0, corruptStart) + properLogic + js.substring(part2Start);
        
        while (finalJS.trim().endsWith('});') || finalJS.trim().endsWith('}')) {
             if (finalJS.trim().endsWith('});')) {
                 finalJS = finalJS.trim().substring(0, finalJS.trim().length - 3);
             } else {
                 finalJS = finalJS.trim().substring(0, finalJS.trim().length - 1);
             }
        }
        
        finalJS = finalJS.trim() + `
    }
}
});
`;
        fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', finalJS);
        console.log("Fixed!");
    }
}
