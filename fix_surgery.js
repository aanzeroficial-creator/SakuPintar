const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');


const corruptStart = js.indexOf("/* \\n * Proyek Web Edukasi", js.indexOf('rouletteContainer'));

if (corruptStart !== -1) {
    
    
    
    
    const secondRoulette = js.indexOf("const rouletteContainer = document.getElementById('rouletteContainer');", corruptStart);
    
    if (secondRoulette !== -1) {
        
        
        
        
        
        
        
        
        const part2Start = js.indexOf("// Simpan uang saku dan gender spesifik ke localStorage", secondRoulette);
        
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
        
        
        while (finalJS.trim().endsWith('});')) {
            finalJS = finalJS.trim().substring(0, finalJS.trim().length - 3);
        }
        while (finalJS.trim().endsWith('}')) {
             finalJS = finalJS.trim().substring(0, finalJS.trim().length - 1);
        }
        
        
        
        
        
        
        
        finalJS = finalJS.trim() + `
    }
}
});
`;
        fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', finalJS);
        console.log("Fixed!");
    } else {
        console.log("second roulette not found");
    }
} else {
    console.log("corrupt start not found");
}
