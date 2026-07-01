const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/kuis-belanja.js', 'utf8');

const jsLogic = `
    // --- LOGIKA FASE PRA-KUIS ---
    const panelPilihBarang = document.getElementById('panelPilihBarang');
    const panelDompet = document.getElementById('panelDompet');
    const btnRaksasaRak = document.getElementById('btnRaksasaRak');
    const gameHeader = document.getElementById('gameHeader');
    const pertanyaanKasir = document.getElementById('pertanyaanKasir');

    // 1. Sembunyikan Sisa Uang Saku di header saat Pra-Kuis
    if (gameHeader) {
        const scoreDiv = gameHeader.querySelector('.score');
        if (scoreDiv) scoreDiv.style.visibility = 'hidden';
    }
    
    // 2. Ubah dialog awal kasir
    if (pertanyaanKasir && panelPilihBarang) {
        pertanyaanKasir.innerHTML = \`Halo! Selamat datang di Toko Saku Pintar!<br>Silakan klik tombol <strong>Masuk ke Rak Toko</strong> yang ada di tengah.\`;
    }

    if (btnRaksasaRak) {
        btnRaksasaRak.addEventListener('click', () => {
            if (typeof playClickSound === 'function') playClickSound();
            if (typeof modalRak !== 'undefined') modalRak.style.display = 'flex';
        });
    }
    
    // 3. Timpa logika btnMulaiBermain
    const oldBtnMulaiClick = \`btnMulaiBermain.addEventListener('click', () => {
            // Ambil semua barang yang jumlahPilihannya > 0
            keranjangPilihan = allItems.filter(item => item.jumlahPilihan > 0).map(item => ({...item, jumlah: item.jumlahPilihan}));
            
            if (keranjangPilihan.length === 0) {
                Swal.fire({
                    title: 'Keranjang Kosong!',
                    text: 'Pilih minimal 1 barang untuk dibeli ya!',
                    icon: 'warning',
                    confirmButtonText: 'Oke'
                });
                return;
            }

            modalRak.style.display = 'none';
            currentCheckoutIndex = 0;
            uangTerkumpul = 0;
            updateCashierUI();
            renderPercakapanKasir();
        });\`;

    const newBtnMulaiClick = \`btnMulaiBermain.addEventListener('click', () => {
            // Ambil semua barang yang jumlahPilihannya > 0
            keranjangPilihan = allItems.filter(item => item.jumlahPilihan > 0).map(item => ({...item, jumlah: item.jumlahPilihan}));
            
            if (keranjangPilihan.length === 0) {
                Swal.fire({
                    title: 'Keranjang Kosong!',
                    text: 'Pilih minimal 1 barang untuk dibeli ya!',
                    icon: 'warning',
                    confirmButtonText: 'Oke'
                });
                return;
            }

            modalRak.style.display = 'none';
            
            // TRANSISI KE FASE BAYAR (KASIR)
            if (panelPilihBarang && panelDompet) {
                panelPilihBarang.style.display = 'none';
                panelDompet.style.display = 'inline-block';
                // Trigger reflow for animation
                void panelDompet.offsetWidth;
                panelDompet.style.opacity = '1';
                panelDompet.style.transform = 'scale(1)';
            }
            
            if (gameHeader) {
                const scoreDiv = gameHeader.querySelector('.score');
                if (scoreDiv) scoreDiv.style.visibility = 'visible';
            }

            currentCheckoutIndex = 0;
            uangTerkumpul = 0;
            updateCashierUI();
            renderPercakapanKasir();
        });\`;

`;

if (js.includes('btnMulaiBermain.addEventListener(\\\'click\\\', () => {')) {
    
    

    js = js.replace('document.addEventListener(\\'DOMContentLoaded\\', async () => {', 'document.addEventListener(\\'DOMContentLoaded\\', async () => {\\n' + `
    const panelPilihBarang = document.getElementById('panelPilihBarang');
    const panelDompet = document.getElementById('panelDompet');
    const btnRaksasaRak = document.getElementById('btnRaksasaRak');
    
    // 1. Sembunyikan Sisa Uang Saku di header saat Pra-Kuis
    const scoreDiv = document.querySelector('.score');
    if (scoreDiv && panelPilihBarang) scoreDiv.style.visibility = 'hidden';
    
    // 2. Ubah dialog awal kasir
    if (pertanyaanKasir && panelPilihBarang) {
        pertanyaanKasir.innerHTML = \`Halo! Selamat datang di Toko Saku Pintar!<br>Silakan klik tombol <strong>Masuk ke Rak Toko</strong> yang ada di tengah.\`;
    }

    if (btnRaksasaRak) {
        btnRaksasaRak.addEventListener('click', () => {
            if (typeof playClickSound === 'function') playClickSound();
            if (typeof modalRak !== 'undefined') modalRak.style.display = 'flex';
        });
    }
`);

    
    const searchString = `btnMulaiBermain.addEventListener('click', () => {
            // Ambil semua barang yang jumlahPilihannya > 0
            keranjangPilihan = allItems.filter(item => item.jumlahPilihan > 0).map(item => ({...item, jumlah: item.jumlahPilihan}));
            
            if (keranjangPilihan.length === 0) {
                Swal.fire({
                    title: 'Keranjang Kosong!',
                    text: 'Pilih minimal 1 barang untuk dibeli ya!',
                    icon: 'warning',
                    confirmButtonText: 'Oke'
                });
                return;
            }

            modalRak.style.display = 'none';
            currentCheckoutIndex = 0;
            uangTerkumpul = 0;
            updateCashierUI();
            renderPercakapanKasir();
        });`;

    const replaceString = `btnMulaiBermain.addEventListener('click', () => {
            // Ambil semua barang yang jumlahPilihannya > 0
            keranjangPilihan = allItems.filter(item => item.jumlahPilihan > 0).map(item => ({...item, jumlah: item.jumlahPilihan}));
            
            if (keranjangPilihan.length === 0) {
                Swal.fire({
                    title: 'Keranjang Kosong!',
                    text: 'Pilih minimal 1 barang untuk dibeli ya!',
                    icon: 'warning',
                    confirmButtonText: 'Oke'
                });
                return;
            }

            modalRak.style.display = 'none';
            
            // TRANSISI KE FASE BAYAR (KASIR)
            if (panelPilihBarang && panelDompet) {
                panelPilihBarang.style.display = 'none';
                panelDompet.style.display = 'inline-block';
                // Trigger reflow for animation
                void panelDompet.offsetWidth;
                panelDompet.style.opacity = '1';
                panelDompet.style.transform = 'scale(1)';
            }
            
            const scoreDivLocal = document.querySelector('.score');
            if (scoreDivLocal) scoreDivLocal.style.visibility = 'visible';

            currentCheckoutIndex = 0;
            uangTerkumpul = 0;
            updateCashierUI();
            renderPercakapanKasir();
        });`;

    
    
    const smallSearch = `modalRak.style.display = 'none';
            currentCheckoutIndex = 0;
            uangTerkumpul = 0;
            updateCashierUI();
            renderPercakapanKasir();`;
            
    const smallReplace = `modalRak.style.display = 'none';
            
            // TRANSISI KE FASE BAYAR (KASIR)
            if (panelPilihBarang && panelDompet) {
                panelPilihBarang.style.display = 'none';
                panelDompet.style.display = 'inline-block';
                // Trigger reflow for animation
                void panelDompet.offsetWidth;
                panelDompet.style.opacity = '1';
                panelDompet.style.transform = 'scale(1)';
            }
            
            const scoreDivLocal = document.querySelector('.score');
            if (scoreDivLocal) scoreDivLocal.style.visibility = 'visible';

            currentCheckoutIndex = 0;
            uangTerkumpul = 0;
            updateCashierUI();
            renderPercakapanKasir();`;

    js = js.replace(smallSearch, smallReplace);
    fs.writeFileSync('d:/New folder (3)/student/js/kuis-belanja.js', js);
    console.log('Modified JS');
} else {
    console.log('Could not find btnMulaiBermain logic');
}
