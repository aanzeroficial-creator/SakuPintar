const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/kuis-belanja.js', 'utf8');

const warningLogic = `
    // --- FITUR PERINGATAN RAK TOKO ---
    const gameArea = document.getElementById('gameArea');
    const btnBukaRakNode = document.getElementById('btnBukaRak');
    
    if (gameArea && btnBukaRakNode) {
        gameArea.addEventListener('click', (e) => {
            // Jika keranjang kosong (belum belanja) dan yang diklik bukan modal rak
            if ((!keranjangPilihan || keranjangPilihan.length === 0) && !e.target.closest('.modal-rak')) {
                // Mainkan suara peringatan (opsional)
                if (typeof playClickSound === 'function') playClickSound();
                
                // Tampilkan Peringatan
                Swal.fire({
                    icon: 'warning',
                    title: 'Pergi ke Rak Toko Dulu!',
                    text: 'Kamu harus mengeklik tombol Rak Toko dan memilih barang sebelum bisa membayar di kasir.',
                    confirmButtonColor: '#F1C40F',
                    confirmButtonText: '🛒 Oke!'
                });

                // Animasikan tombol Rak Toko
                btnBukaRakNode.style.transition = 'all 0.3s ease';
                btnBukaRakNode.style.transform = 'scale(1.5)';
                btnBukaRakNode.style.boxShadow = '0 0 20px #E74C3C, 0 0 40px #F1C40F';
                btnBukaRakNode.style.zIndex = '9999';
                btnBukaRakNode.style.position = 'relative';

                // Kembalikan ke ukuran normal setelah 1.5 detik
                setTimeout(() => {
                    btnBukaRakNode.style.transform = 'scale(1)';
                    btnBukaRakNode.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    btnBukaRakNode.style.zIndex = 'auto';
                }, 1500);
            }
        }, true); // Gunakan 'true' (useCapture) agar menangkap klik paling awal
    }
`;


if (js.includes('document.addEventListener(\\'DOMContentLoaded\\', async () => {')) {
    js = js.replace('document.addEventListener(\\'DOMContentLoaded\\', async () => {', 'document.addEventListener(\\'DOMContentLoaded\\', async () => {\\n' + warningLogic);
    fs.writeFileSync('d:/New folder (3)/student/js/kuis-belanja.js', js);
    console.log('Injected warning logic into kuis-belanja.js');
} else {
    console.log('Could not find DOMContentLoaded in kuis-belanja.js');
}
