const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/shared/js/firebase-db.js', 'utf8');

const newFunc = `
// =========================================
// FITUR RIWAYAT BELANJA SPESIFIK SISWA
// =========================================
window.getRiwayatBelanjaSiswa = async function(namaSiswa) {
    try {
        const snapshot = await resultsCol
            .where('nama', '==', namaSiswa)
            .where('aktivitas', '==', 'Perencanaan Keuangan')
            .get();
        
        let riwayat = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            riwayat.push({ id: doc.id, ...data });
        });
        
        // Urutkan dari yang terbaru (timestamp)
        riwayat.sort((a, b) => b.timestamp - a.timestamp);
        return riwayat;
    } catch (e) {
        console.error("Error getting riwayat belanja siswa: ", e);
        return [];
    }
};
`;

if (!js.includes('getRiwayatBelanjaSiswa')) {
    js += '\n' + newFunc;
    fs.writeFileSync('d:/New folder (3)/shared/js/firebase-db.js', js);
    console.log("getRiwayatBelanjaSiswa injected");
} else {
    console.log("Already exists");
}
