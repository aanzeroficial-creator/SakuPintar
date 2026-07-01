const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/kuis-belanja.js', 'utf8');

const logicAIPanel = `
    // ==========================================
    // FUNGSI EVALUASI AI & GATEKEEPER GURU
    // ==========================================
    async function mulaiEvaluasiAI(docId) {
        const panelEvaluasiAI = document.getElementById('panelEvaluasiAI');
        const aiLoading = document.getElementById('aiLoading');
        const aiResult = document.getElementById('aiResult');
        const aiTabelBody = document.getElementById('aiTabelBody');
        const statusIzinArea = document.getElementById('statusIzinArea');
        const btnLanjutMisi = document.getElementById('btnLanjutMisi');
        const statusIzinText = document.getElementById('statusIzinText');
        const statusIzinIcon = document.getElementById('statusIzinIcon');

        // Tampilkan panel
        panelEvaluasiAI.style.display = 'flex';
        aiLoading.style.display = 'flex';
        aiResult.style.display = 'none';
        statusIzinArea.style.display = 'none';

        // Ambil cerita dari localStorage
        const ceritaMisi = localStorage.getItem('teksMisiCerita') || "Tidak ada cerita khusus.";
        
        // Siapkan prompt untuk AI
        const promptSystem = "Kamu adalah guru literasi finansial. Berikan evaluasi pada barang belanjaan siswa berdasarkan cerita misinya. Jawab dalam format JSON Array: [ { \\"barang\\": \\"nama\\", \\"kategori\\": \\"Kebutuhan\\" / \\"Keinginan\\", \\"alasan\\": \\"alasan singkat maksimal 1 kalimat\\" } ]";
        
        const dataBarang = daftarBelanjaan.map(b => b.nama).join(", ");
        const promptUser = \`Cerita Misi: "\${ceritaMisi}"\\nBarang yang dibeli: \${dataBarang}\\nKlasifikasikan setiap barang.\`;

        try {
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const API_URL = isLocal ? 'http://localhost:3000/api/chat' : '/api/chat';
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: promptSystem },
                        { role: 'user', content: promptUser }
                    ]
                })
            });

            if (!response.ok) throw new Error("Gagal mengambil data dari AI");
            
            const data = await response.json();
            let aiText = data.reply;
            
            // Bersihkan JSON markdown backticks jika ada
            aiText = aiText.replace(/\\r?\\n/g, "");
            aiText = aiText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "");
            
            const parsedData = JSON.parse(aiText);
            
            // Render Tabel
            aiTabelBody.innerHTML = '';
            parsedData.forEach(item => {
                const kelasKategori = item.kategori.toLowerCase() === 'kebutuhan' ? 'kategori-kebutuhan' : 'kategori-keinginan';
                aiTabelBody.innerHTML += \`
                    <tr style="background: #ECF0F1; border-bottom: 1px solid #BDC3C7;">
                        <td style="padding: 15px;"><strong>\${item.barang}</strong></td>
                        <td style="padding: 15px;"><span class="\${kelasKategori}">\${item.kategori}</span></td>
                        <td style="padding: 15px; text-align: left;">\${item.alasan}</td>
                    </tr>
                \`;
            });

        } catch (e) {
            console.error("AI Error:", e);
            aiTabelBody.innerHTML = \`
                <tr>
                    <td colspan="3" style="padding: 15px; color: #E74C3C;">Maaf, gagal memuat evaluasi AI. Server mungkin sedang sibuk.</td>
                </tr>
            \`;
        }

        // Tampilkan hasil dan area izin
        aiLoading.style.display = 'none';
        aiResult.style.display = 'block';
        statusIzinArea.style.display = 'block';

        // Pantau persetujuan guru via Firestore
        if (typeof db !== 'undefined' && docId) {
            db.collection('perencanaan').doc(docId).onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    if (data.izinLanjut === true) {
                        statusIzinIcon.innerHTML = '✅';
                        statusIzinText.innerHTML = '<strong style="color: #27AE60;">Guru telah memberikan izin!</strong> Kamu bekerja dengan hebat.';
                        btnLanjutMisi.disabled = false;
                        btnLanjutMisi.classList.add('btn-lanjut-aktif');
                        btnLanjutMisi.textContent = 'Lanjut ke Peta 🚀';
                    }
                }
            });
        }
        
        btnLanjutMisi.addEventListener('click', () => {
            if (!btnLanjutMisi.disabled) {
                window.location.href = 'index.html';
            }
        });
    }

`;

if (!js.includes('mulaiEvaluasiAI')) {
    js = js.replace('/* =========================================', logicAIPanel + '\\n    /* =========================================');
    
    
    
    const oldSimpanFirestore = `// Simpan ke Firestore
            if (typeof db !== 'undefined') {
                await db.collection('perencanaan').add({
                    namaSiswa: userNama,
                    saldoAwal: saldoAwal,
                    sisaSaldo: uangSaku,
                    daftarBelanjaan: daftarBelanjaan,
                    rencanaSisaUang: rencana,
                    tanggal: firebase.firestore.FieldValue.serverTimestamp()
                });
            }`;

    const newSimpanFirestore = `let docRefId = null;
            // Simpan ke Firestore
            if (typeof db !== 'undefined') {
                const docRef = await db.collection('perencanaan').add({
                    namaSiswa: userNama,
                    saldoAwal: saldoAwal,
                    sisaSaldo: uangSaku,
                    daftarBelanjaan: daftarBelanjaan,
                    rencanaSisaUang: rencana,
                    tanggal: firebase.firestore.FieldValue.serverTimestamp(),
                    izinLanjut: false
                });
                docRefId = docRef.id;
            }`;

    js = js.replace(oldSimpanFirestore, newSimpanFirestore);
    
    
    const oldSuccessSwal = `Swal.fire({
                title: 'Berhasil Menyimpan!',
                text: 'Laporan belanjamu sudah dicatat di buku tabungan.',
                icon: 'success',
                confirmButtonColor: '#27AE60'
            });
            btnSimpanEvaluasi.disabled = false;
            btnSimpanEvaluasi.textContent = '💾 Simpan ke Buku Tabungan';`;
            
    const newSuccessSwal = `
            // Sembunyikan modal evaluasi
            const modalEvaluasi = document.getElementById('modalEvaluasi');
            if (modalEvaluasi) modalEvaluasi.style.display = 'none';
            
            // Panggil Evaluasi AI
            mulaiEvaluasiAI(docRefId);
            
            btnSimpanEvaluasi.disabled = false;
            btnSimpanEvaluasi.textContent = '💾 Simpan ke Buku Tabungan';`;
            
    js = js.replace(oldSuccessSwal, newSuccessSwal);
    
    fs.writeFileSync('d:/New folder (3)/student/js/kuis-belanja.js', js);
    console.log("Injected AI logic into JS");
} else {
    console.log("AI logic already exists");
}
