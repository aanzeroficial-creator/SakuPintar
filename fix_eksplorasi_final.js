const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');


const firstIndex = js.indexOf("document.addEventListener('DOMContentLoaded'");
const secondIndex = js.indexOf("document.addEventListener('DOMContentLoaded'", firstIndex + 1);

if (secondIndex !== -1) {
    
    const headerStart = js.lastIndexOf('/*', secondIndex);
    
    
    
    
    
    
    
    
    
    
    
    console.log("Found duplicate at index", secondIndex);
    
    
    
    
    
    
    const part1End = js.indexOf("const hasil = await drawRandomStory(kelompokId);") + "const hasil = await drawRandomStory(kelompokId);".length;
    
    const part2Start = js.lastIndexOf("// Simpan uang saku dan gender spesifik ke localStorage");
    
    if (part1End !== -1 && part2Start !== -1 && part2Start > part1End) {
        let cleanJS = js.substring(0, part1End) + `
            
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

            ` + js.substring(part2Start);
        
        
        cleanJS = cleanJS.replace(/\\}\\);\\s*\\}\\);\\s*$/g, '});\\n');
        cleanJS = cleanJS.replace(/\\}\\);\\s*$/g, '});\\n');
        
        fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', cleanJS);
        console.log("Successfully rebuilt eksplorasi.js");
    } else {
        console.log("Could not find part1 or part2 markers.");
    }
} else {
    console.log("No duplicate found!");
}
