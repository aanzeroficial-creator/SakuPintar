const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/teacher/js/teacher-main.js', 'utf8');


const izinkanLogic = `
window.izinkanSiswa = async function(namaSiswa) {
    if(!confirm(\`Berikan izin kepada \${namaSiswa} untuk melanjutkan misi?\`)) return;
    try {
        const snapshot = await db.collection('perencanaan')
            .where('namaSiswa', '==', namaSiswa)
            .orderBy('tanggal', 'desc')
            .limit(1)
            .get();
            
        if (!snapshot.empty) {
            const docId = snapshot.docs[0].id;
            await db.collection('perencanaan').doc(docId).update({ izinLanjut: true });
            alert('Izin berhasil diberikan!');
        } else {
            alert('Data perencanaan asli tidak ditemukan di database.');
        }
    } catch (e) {
        console.error("Error izin:", e);
        // Fallback if index doesn't exist (no orderBy support without index)
        if (e.message && e.message.includes('index')) {
            try {
                const snapshot2 = await db.collection('perencanaan')
                    .where('namaSiswa', '==', namaSiswa)
                    .get();
                if (!snapshot2.empty) {
                    // Sort manually if needed, or just take the last
                    let latestDoc = snapshot2.docs[snapshot2.docs.length - 1];
                    await db.collection('perencanaan').doc(latestDoc.id).update({ izinLanjut: true });
                    alert('Izin berhasil diberikan (Fallback mode)!');
                }
            } catch(err2) {
                alert('Gagal memberikan izin. Cek koneksi.');
            }
        } else {
            alert('Gagal memberikan izin. Cek koneksi.');
        }
    }
};
`;

if (!js.includes('izinkanSiswa')) {
    js = js + '\\n' + izinkanLogic;
}


const tableRenderOld = `                      <td style="vertical-align: top; text-align:left;">\${rincian}</td>
                  \`;
                  
                  planTableBody.appendChild(tr);`;

const tableRenderNew = `                      <td style="vertical-align: top; text-align:left;">\${rincian}</td>
                      <td style="vertical-align: top; text-align:center;">
                          <button onclick="izinkanSiswa('\${r.nama}')" style="background:#2ecc71; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.2);">✅ Izinkan</button>
                      </td>
                  \`;
                  
                  planTableBody.appendChild(tr);`;

if (js.includes(tableRenderOld)) {
    js = js.replace(tableRenderOld, tableRenderNew);
    fs.writeFileSync('d:/New folder (3)/teacher/js/teacher-main.js', js);
    console.log("Teacher JS updated.");
} else {
    console.log("Could not find table render target.");
}
