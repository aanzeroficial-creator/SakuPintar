document.addEventListener('DOMContentLoaded', async () => {
    const aiLoading = document.getElementById('aiLoading');
    const aiResult = document.getElementById('aiResult');
    const aiTabelBody = document.getElementById('aiTabelBody');
    const statusIzinArea = document.getElementById('statusIzinArea');
    const btnLanjutMisi = document.getElementById('btnLanjutMisi');
    const statusIzinText = document.getElementById('statusIzinText');
    const statusIzinIcon = document.getElementById('statusIzinIcon');

    
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('docId');

    if (!docId) {
        Swal.fire({
            icon: 'error',
            title: 'Data Tidak Ditemukan',
            text: 'ID Laporan tidak valid atau hilang. Kembali ke Peta Utama.'
        }).then(() => {
            window.location.href = 'index.html';
        });
        return;
    }

    let dataPerencanaan = null;
    let daftarBelanjaan = [];
    let kunciJawaban = [];
    let parsedData = null;

    try {

        
        let attempts = 0;
        while (typeof db === 'undefined' && attempts < 10 && window.navigator.onLine) {
            await new Promise(r => setTimeout(r, 500));
            attempts++;
        }

        if (typeof db !== 'undefined' && docId) {
            
            const docRef = await db.collection('perencanaan').doc(docId).get();
            if (!docRef.exists) {
                throw new Error("Laporan tidak ditemukan di database.");
            }
            dataPerencanaan = docRef.data();
            if (dataPerencanaan.izinLanjut !== true) {
                throw new Error("Akses Ditolak: Guru belum menyetujui laporan belanjamu!");
            }
            daftarBelanjaan = dataPerencanaan.daftarBelanjaan || [];
        } else {
            
            const tempData = sessionStorage.getItem('tempEvaluasiData');
            if (tempData) {
                dataPerencanaan = JSON.parse(tempData);
                daftarBelanjaan = dataPerencanaan.daftarBelanjaan || [];
            } else {
                throw new Error("Koneksi internet terputus dan tidak ada data sesi.");
            }
        }
        
        
        let storySettings = {};
        try {
            if (typeof getStorySettings === 'function') {
                storySettings = await getStorySettings();
            }
        } catch(err) {
            console.error("Gagal memuat story settings:", err);
        }

        const kelompokSiswa = dataPerencanaan.kelompok || localStorage.getItem('kelompokMisiCerita') || 1;
        const storyIndex = (storySettings.alokasiCerita && typeof storySettings.alokasiCerita[kelompokSiswa] !== 'undefined') ? storySettings.alokasiCerita[kelompokSiswa] : 0;
        const activeStory = (storySettings.kumpulanCerita && storySettings.kumpulanCerita[storyIndex]) ? storySettings.kumpulanCerita[storyIndex] : {};
        kunciJawaban = activeStory.kunciJawaban || [];

        
        const semuaAdaKunci = daftarBelanjaan.every(item => 
            kunciJawaban.some(k => item.nama.toLowerCase().trim().includes(k.barang.toLowerCase().trim()))
        );

        parsedData = null;

        if (semuaAdaKunci && daftarBelanjaan.length > 0) {
            console.log("Semua barang terdaftar di kunci jawaban paten. Menggunakan evaluasi lokal (Instan/Bypass AI).");
            const evaluasiBarang = daftarBelanjaan.map(item => {
                const match = kunciJawaban.find(k => item.nama.toLowerCase().trim().includes(k.barang.toLowerCase().trim()));
                return {
                    barang: item.nama,
                    kategori: match.kategori,
                    alasan: match.alasan
                };
            });

            let jmlKebutuhan = 0;
            let jmlKeinginan = 0;
            evaluasiBarang.forEach(e => {
                if (e.kategori.toLowerCase() === 'kebutuhan') jmlKebutuhan++;
                else jmlKeinginan++;
            });

            let evaluasiKeuangan = '';
            if (jmlKebutuhan > 0 && jmlKeinginan === 0) {
                evaluasiKeuangan = `Pengelolaan uang kamu Sangat Bijak karena seluruh barang yang kamu beli adalah Kebutuhan untuk menyelesaikan Misi Cerita. Kamu hebat dalam memprioritaskan kebutuhan!`;
            } else if (jmlKebutuhan > jmlKeinginan && jmlKeinginan > 0) {
                evaluasiKeuangan = `Pengelolaan uang kamu Bijak karena kamu memprioritaskan barang Kebutuhan dibandingkan barang Keinginan untuk menyelesaikan Misi Cerita. Pertahankan pengelolaan uang yang baik ini ya!`;
            } else if (jmlKebutuhan === jmlKeinginan && jmlKebutuhan > 0) {
                evaluasiKeuangan = `Pengelolaan uang kamu Kurang Bijak karena kamu membeli barang Keinginan sama banyaknya dengan Kebutuhan. Cobalah lebih memprioritaskan kebutuhan di misi berikutnya!`;
            } else {
                evaluasiKeuangan = `Pengelolaan uang kamu Tidak Bijak karena kamu membeli lebih banyak barang Keinginan dibandingkan barang Kebutuhan untuk menyelesaikan Misi Cerita. Di misi berikutnya, utamakan kebutuhan tugas terlebih dahulu ya!`;
            }

            parsedData = { evaluasiBarang, evaluasiKeuangan };
        } else {
            console.log("Beberapa barang belum terdaftar di kunci jawaban paten. Memanggil AI Evaluasi...");
            const ceritaMisi = localStorage.getItem('teksMisiCerita') || "Tidak ada cerita khusus.";
            
            let kunciJawabanContext = "";
            if (kunciJawaban && kunciJawaban.length > 0) {
                kunciJawabanContext = "Kunci Jawaban Guru (Gunakan ini sebagai acuan utama klasifikasi jika ada kecocokan barang):\n" + 
                    kunciJawaban.map(k => `- Barang: "${k.barang}" -> Kategori: "${k.kategori}", Alasan: "${k.alasan}"`).join("\n") + "\n\n";
            }

            const promptSystem = `Kamu adalah analis literasi finansial yang sangat teliti. Tugas utamamu adalah mengklasifikasikan barang belanjaan menjadi "Kebutuhan" atau "Keinginan" secara MUTLAK berdasarkan Cerita Misi yang diberikan dan Kunci Jawaban Guru jika tersedia, serta mengevaluasi pengelolaan uangnya.

ATURAN KETAT: 
1. KUNCI JAWABAN GURU: Jika diberikan 'Kunci Jawaban Guru', untuk setiap barang yang dibeli siswa yang tertera di kunci jawaban tersebut, kamu WAJIB menyamakan kategori ("Kebutuhan" atau "Keinginan") dan alasan dengan yang diinput oleh Guru. Pastikan nama barang ditulis persis seperti di kunci jawaban.
2. ANALISIS CERITA MISI: Untuk barang-barang yang tidak tertera di Kunci Jawaban Guru, klasifikasikan berdasarkan Cerita Misi yang diberikan secara logis. Kebutuhan = barang yang diperlukan karakter untuk memecahkan masalah utama di cerita. Keinginan = barang lain di luar itu. Cerita Misi harus tetap menjadi dasar analisis pertimbangan utama baik untuk barang yang tidak ada di kunci jawaban maupun dalam merangkai alasan.
3. Cerita Misi harus tetap dianalisis secara mendalam baik untuk klasifikasi barang yang tidak ada di kunci jawaban maupun untuk memberikan penjelasan secara kontekstual dalam evaluasi keuangan.
4. EVALUASI KEUANGAN = Berikan komentar evaluasi singkat keputusan belanja siswa. PENTING: Wajib gunakan kata ganti 'kamu' (jangan sebut nama karakter cerita atau kata 'siswa'). Kalimat komentar wajib diawali dengan kata 'Pengelolaan uang kamu [Sangat Bijak/Bijak/Kurang Bijak/Tidak Bijak] karena...' lalu jelaskan alasannya dengan kata ganti 'kamu' secara kontekstual dengan Cerita Misi. PENTING: Jangan gunakan kata 'seimbang' dalam komentar evaluasi. Komentar maksimal 2 kalimat.

Jawab WAJIB dalam format JSON murni tanpa markdown: { "evaluasiBarang": [ { "barang": "nama", "kategori": "Kebutuhan" / "Keinginan", "alasan": "alasan spesifik sesuai cerita/kunci jawaban, maks 15 kata" } ], "evaluasiKeuangan": "komentar singkat keputusan belanja diawali dengan 'Pengelolaan uang kamu ...' menggunakan kata ganti 'kamu', maks 2 kalimat." }`;
            
            const uangInfo = `Modal Awal: Rp${dataPerencanaan.saldoAwal}, Sisa Uang: Rp${dataPerencanaan.sisaSaldo}, Rencana Sisa Uang: "${dataPerencanaan.rencanaSisaUang}"`;
            const dataBarang = daftarBelanjaan.map(b => b.nama).join(", ");
            const promptUser = `Cerita Misi: "${ceritaMisi}"\n\n${kunciJawabanContext}${uangInfo}\nBarang yang dibeli: ${dataBarang}\nKlasifikasikan barang dan evaluasi pengelolaan uang.`;

            
            aiLoading.style.display = 'none';
            aiResult.style.display = 'block';
            aiTabelBody.innerHTML = '';
            daftarBelanjaan.forEach(item => {
                aiTabelBody.innerHTML += `
                    <tr style="background: #ECF0F1; border-bottom: 1px solid #BDC3C7;">
                        <td style="padding: 15px;"><strong>${item.nama}</strong></td>
                        <td style="padding: 15px;"><span style="color: #E67E22; font-style: italic; font-weight: bold;">⏳ Memproses...</span></td>
                        <td style="padding: 15px; text-align: left; color: #7F8C8D; font-style: italic;">Sistem sedang menganalisis fungsi barang ini...</td>
                    </tr>
                `;
            });

            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
            const API_URL = isLocal ? 'http://localhost:3000/api/chat' : '/api/chat';

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: promptUser,
                    systemPrompt: promptSystem
                })
            });

            if (!response.ok) throw new Error("Gagal mengambil data dari server AI");
            
            const data = await response.json();
            let aiText = data.reply;
            aiText = aiText.replace(/\r?\n/g, "").replace(/```json/g, "").replace(/```/g, "");
            
            const rawParsed = JSON.parse(aiText);
            
            
            const evaluasiBarang = (rawParsed.evaluasiBarang || []).map(item => {
                const match = kunciJawaban.find(k => item.barang.toLowerCase().trim().includes(k.barang.toLowerCase().trim()));
                if (match) {
                    return {
                        barang: item.barang,
                        kategori: match.kategori,
                        alasan: match.alasan
                    };
                }
                return item;
            });

            
            let jmlKebutuhan = 0;
            let jmlKeinginan = 0;
            evaluasiBarang.forEach(e => {
                if (e.kategori.toLowerCase() === 'kebutuhan') jmlKebutuhan++;
                else jmlKeinginan++;
            });

            let evaluasiKeuangan = '';
            if (jmlKebutuhan > 0 && jmlKeinginan === 0) {
                evaluasiKeuangan = `Pengelolaan uang kamu Sangat Bijak karena seluruh barang yang kamu beli adalah Kebutuhan untuk menyelesaikan Misi Cerita. Kamu hebat dalam memprioritaskan kebutuhan!`;
            } else if (jmlKebutuhan > jmlKeinginan && jmlKeinginan > 0) {
                evaluasiKeuangan = `Pengelolaan uang kamu Bijak karena kamu memprioritaskan barang Kebutuhan dibandingkan barang Keinginan untuk menyelesaikan Misi Cerita. Pertahankan pengelolaan uang yang baik ini ya!`;
            } else if (jmlKebutuhan === jmlKeinginan && jmlKebutuhan > 0) {
                evaluasiKeuangan = `Pengelolaan uang kamu Kurang Bijak karena jumlah barang Kebutuhan dan Keinginan yang kamu beli seimbang. Cobalah lebih memprioritaskan kebutuhan di misi berikutnya!`;
            } else {
                evaluasiKeuangan = `Pengelolaan uang kamu Tidak Bijak karena kamu membeli lebih banyak barang Keinginan dibandingkan barang Kebutuhan untuk menyelesaikan Misi Cerita. Di misi berikutnya, utamakan kebutuhan tugas terlebih dahulu ya!`;
            }

            parsedData = { evaluasiBarang, evaluasiKeuangan };
        }

        
        aiTabelBody.innerHTML = '';
        const daftarEvaluasi = parsedData.evaluasiBarang || [];
        daftarEvaluasi.forEach(item => {
            const kelasKategori = item.kategori.toLowerCase() === 'kebutuhan' ? 'kategori-kebutuhan' : 'kategori-keinginan';
            aiTabelBody.innerHTML += `
                <tr style="background: #ECF0F1; border-bottom: 1px solid #BDC3C7;">
                    <td style="padding: 15px;"><strong>${item.barang}</strong></td>
                    <td style="padding: 15px;"><span class="${kelasKategori}">${item.kategori}</span></td>
                    <td style="padding: 15px; text-align: left;">${item.alasan}</td>
                </tr>
            `;
        });

        
        const aiKeuangan = document.getElementById('aiKeuangan');
        const aiKeuanganText = document.getElementById('aiKeuanganText');
        if (aiKeuangan && aiKeuanganText && parsedData.evaluasiKeuangan) {
            aiKeuanganText.textContent = parsedData.evaluasiKeuangan;
            aiKeuangan.style.display = 'block';
        }

        
        const kunciJawabanArea = document.getElementById('kunciJawabanArea');
        const kunciTabelBody = document.getElementById('kunciTabelBody');
        if (kunciJawabanArea && kunciTabelBody) {
            if (kunciJawaban && kunciJawaban.length > 0) {
                kunciTabelBody.innerHTML = '';
                kunciJawaban.forEach(k => {
                    const kelasKategori = k.kategori.toLowerCase() === 'kebutuhan' ? 'kategori-kebutuhan' : 'kategori-keinginan';
                    kunciTabelBody.innerHTML += `
                        <tr style="background: #F8F9F9; border-bottom: 1px solid #BDC3C7;">
                            <td style="padding: 15px; text-align: left;"><strong>${k.barang}</strong></td>
                            <td style="padding: 15px; text-align: center;"><span class="${kelasKategori}">${k.kategori}</span></td>
                            <td style="padding: 15px; text-align: left;">${k.alasan}</td>
                        </tr>
                    `;
                });
                kunciJawabanArea.style.display = 'block';
            } else {
                kunciJawabanArea.style.display = 'none';
            }
        }

    } catch (e) {
        console.error("AI Error:", e);
        
        if (e.message && e.message.includes("Akses Ditolak")) {
            Swal.fire({
                icon: 'error',
                title: 'Akses Ditolak',
                text: e.message,
                confirmButtonText: 'Kembali ke Peta Utama',
                confirmButtonColor: '#E74C3C',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                window.location.href = 'index.html';
            });
            return; 
        }
        
        aiTabelBody.innerHTML = `
            <tr>
                <td colspan="3" style="padding: 15px; color: #E74C3C; text-align: center;">
                    <strong>Evaluasi Sistem Gagal Dimuat</strong><br>
                    ${e.message}<br>
                    <small>Silakan hubungi gurumu atau coba muat ulang halaman!</small>
                </td>
            </tr>
        `;
    }

    
    aiLoading.style.display = 'none';
    aiResult.style.display = 'block';

    
    let benarCount = 0;
    let salahCount = 0;
    let nilai = 0;
    let totalPaten = 0;

    if (kunciJawaban && kunciJawaban.length > 0) {
        totalPaten = kunciJawaban.length;
        
        kunciJawaban.forEach(k => {
            const isBought = parsedData && parsedData.evaluasiBarang && parsedData.evaluasiBarang.some(item => 
                item.barang.toLowerCase().trim().includes(k.barang.toLowerCase().trim()) || 
                k.barang.toLowerCase().trim().includes(item.barang.toLowerCase().trim())
            );

            if (k.kategori.toLowerCase() === 'kebutuhan') {
                if (isBought) {
                    benarCount++; // Membeli kebutuhan = BENAR
                } else {
                    salahCount++; // Tidak membeli kebutuhan = SALAH
                }
            } else if (k.kategori.toLowerCase() === 'keinginan') {
                if (!isBought) {
                    benarCount++; // Tidak membeli keinginan = BENAR
                } else {
                    salahCount++; // Membeli keinginan = SALAH
                }
            }
        });
    }

    if (totalPaten > 0) {
        nilai = Math.min(100, Math.round((benarCount / totalPaten) * 100));
    } else {
        nilai = 100; 
    }    
    Swal.fire({
        title: 'Hasil Evaluasi Belanja',
        html: `
            <div style="font-family: 'Fredoka', 'Segoe UI', sans-serif; text-align: center; padding: 10px;">
                <p style="color: #7F8C8D; font-size: 1.1rem; margin-top: 0; margin-bottom: 20px;">
                    Analisis keputusan belanjamu telah selesai dilakukan.
                </p>
                <div style="background: #FAFDFB; border: 2px solid #2ECC71; border-radius: 15px; padding: 15px 20px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(46,204,113,0.05);">
                    <span style="font-size: 0.9rem; color: #7F8C8D; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px;">
                        Keputusan Benar
                    </span>
                    <span style="font-size: 1.4rem; color: #27AE60; font-weight: 800;">
                        ${benarCount} dari ${totalPaten} Barang
                    </span>
                </div>
                <div style="background: #EBF5FB; border: 2px solid #3498DB; border-radius: 15px; padding: 20px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                    <span style="font-size: 0.95rem; color: #5D6D7E; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">
                        Skor Belanja
                    </span>
                    <span style="font-size: 4rem; font-weight: 900; color: #2980B9; line-height: 1; text-shadow: 0 4px 10px rgba(41,128,185,0.15);">
                        ${nilai}
                    </span>
                </div>
            </div>
        `,
        confirmButtonText: 'Lihat Detail Evaluasi',
        confirmButtonColor: '#3498DB',
        allowOutsideClick: false
    }).then(() => {
        
        const scoreContainer = document.getElementById('nilaiScoreContainer');
        const evalNilai = document.getElementById('evalNilai');
        const evalBenarCount = document.getElementById('evalBenarCount');
        
        if (scoreContainer && evalNilai) {
            evalNilai.textContent = nilai;
            if (evalBenarCount) evalBenarCount.textContent = `${benarCount} dari ${totalPaten}`;
            
            scoreContainer.style.display = 'flex';
            evalNilai.animate([
                { transform: 'scale(1)', color: '#2980B9' },
                { transform: 'scale(1.3)', color: '#27AE60' },
                { transform: 'scale(1)', color: '#27AE60' }
            ], {
                duration: 800,
                easing: 'ease-in-out'
            });
        }
    });
    
    
    btnLanjutMisi.disabled = false;
    btnLanjutMisi.classList.add('btn-lanjut-aktif');
    btnLanjutMisi.textContent = 'Lanjut ke Peta 🚀';
    
    btnLanjutMisi.addEventListener('click', () => {
        if (!btnLanjutMisi.disabled) {
            window.location.href = 'index.html';
        }
    });

});
