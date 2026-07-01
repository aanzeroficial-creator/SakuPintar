const fs = require('fs');
let html = fs.readFileSync('d:/New folder (3)/student/riwayat-perencanaan.html', 'utf8');


if (!html.includes('firebase-app-compat.js')) {
    html = html.replace('</main>', `</main>
    
    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
    <script src="../shared/js/firebase-db.js"></script>
`);
}

const jsOldRegex = /<script>\s*document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{[\s\S]*?\}\);\s*<\/script>/;
const jsNew = `<script>
        document.addEventListener('DOMContentLoaded', async () => {
            const historyListArea = document.getElementById('historyListArea');
            
            // Format Rupiah
            const formatRupiah = (number) => {
                return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
            };

            const siswaAuth = JSON.parse(sessionStorage.getItem('siswaAuth') || '{}');
            const namaSiswa = siswaAuth.nama;

            historyListArea.innerHTML = \`<div style="text-align:center; padding: 40px; color:#7F8C8D;">Sedang memuat data riwayat dari Cloud... ☁️</div>\`;

            // Tunggu Firebase inisialisasi sebentar jika diperlukan, 
            // lalu tarik data
            if (typeof getRiwayatBelanjaSiswa === 'function' && namaSiswa) {
                try {
                    const riwayatCloud = await getRiwayatBelanjaSiswa(namaSiswa);
                    
                    if (riwayatCloud.length === 0) {
                        historyListArea.innerHTML = \`
                            <div class="empty-state">
                                <h2 style="color: #7F8C8D;">Belum Ada Riwayat</h2>
                                <p>Kamu belum pernah mengirim laporan Rencana Keuangan ke Gurumu.</p>
                                <a href="perencanaan.html" class="btn btn-student" style="margin-top: 20px; display: inline-block; background: #3498DB; color: white;">Buat Rencana Baru</a>
                            </div>
                        \`;
                        return;
                    }

                    let htmlContent = '';
                    riwayatCloud.forEach((item, index) => {
                        const isAman = item.sisaUang >= 0;
                        const statusClass = isAman ? 'status-aman' : 'status-minus';
                        
                        let listBarangHtml = \`
                            <table class="report-table">
                                <thead>
                                    <tr>
                                        <th>Nama Pengeluaran</th>
                                        <th>Kategori</th>
                                        <th>Alasan / Kebutuhan</th>
                                        <th>Harga</th>
                                    </tr>
                                </thead>
                                <tbody>
                        \`;

                        if (item.daftarPengeluaran && item.daftarPengeluaran.length > 0) {
                            item.daftarPengeluaran.forEach(brg => {
                                listBarangHtml += \`
                                    <tr>
                                        <td><strong>\${brg.nama}</strong></td>
                                        <td><span class="badge" style="background:#F39C12; color:white; padding:2px 8px; border-radius:10px; font-size:0.8rem;">\${brg.kategori}</span></td>
                                        <td>\${brg.alasan || '-'}</td>
                                        <td style="color:#E74C3C;">\${formatRupiah(brg.harga)}</td>
                                    </tr>
                                \`;
                            });
                        } else {
                            listBarangHtml += \`<tr><td colspan="4" style="text-align:center; color:#7F8C8D;">Tidak ada pengeluaran dicatat.</td></tr>\`;
                        }
                        listBarangHtml += '</tbody></table>';

                        htmlContent += \`
                            <div class="history-card">
                                <div class="history-header">
                                    <span style="font-size: 0.9rem; color: #7F8C8D;">dY"' \${item.waktu || 'Waktu Tidak Diketahui'}</span>
                                    <span class="history-status \${statusClass}">\${item.status || 'Tidak Diketahui'}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; margin-top: 15px; margin-bottom: 15px; background: #F8F9F9; padding: 15px; border-radius: 10px;">
                                    <div>
                                        <div style="font-size: 0.85rem; color: #7F8C8D;">Total Uang Saku</div>
                                        <div style="font-weight: bold; color: #2C3E50; font-size: 1.1rem;">\${formatRupiah(item.uangJajan || 0)}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: 0.85rem; color: #7F8C8D;">Total Pengeluaran</div>
                                        <div style="font-weight: bold; color: #E74C3C; font-size: 1.1rem;">\${formatRupiah(item.totalPengeluaran || 0)}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: 0.85rem; color: #7F8C8D;">Sisa Uang</div>
                                        <div style="font-weight: bold; color: \${isAman ? '#27AE60' : '#E74C3C'}; font-size: 1.1rem;">\${formatRupiah(item.sisaUang || 0)}</div>
                                    </div>
                                </div>
                                
                                \${listBarangHtml}

                                <div style="margin-top: 15px; background: #E8F8F5; padding: 15px; border-radius: 10px; border-left: 4px solid #1ABC9C;">
                                    <strong>Rencana Sisa Uang:</strong><br>
                                    <span style="color:#2C3E50;">\${item.rencanaSisaUang || '-'}</span>
                                </div>
                            </div>
                        \`;
                    });

                    historyListArea.innerHTML = htmlContent;

                } catch (e) {
                    historyListArea.innerHTML = \`<div style="text-align:center; color:#E74C3C;">Terjadi kesalahan saat memuat data.</div>\`;
                    console.error(e);
                }
            } else {
                historyListArea.innerHTML = \`<div style="text-align:center; color:#E74C3C;">Gagal terhubung ke Database.</div>\`;
            }
        });
    </script>`;

html = html.replace(jsOldRegex, jsNew);
fs.writeFileSync('d:/New folder (3)/student/riwayat-perencanaan.html', html);
console.log("Riwayat HTML updated to use Firebase");
