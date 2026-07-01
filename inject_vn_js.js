const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');

const targetOld = `                // Sembunyikan area pilih kelompok, tampilkan hasil
                pilihKelompokArea.style.display = 'none';
                hasilCeritaArea.style.display = 'block';
                
                // Kembalikan efek transisi lambat saat kartu cerita muncul sesuai permintaan
                hasilCeritaArea.classList.add('stumble-transition');`;

const replaceNew = `                // Sembunyikan area pilih kelompok, tapi JANGAN tampilkan hasilCeritaArea lama
                // pilihKelompokArea.style.display = 'none'; // Tetap sembunyikan
                // hasilCeritaArea.style.display = 'block';
                
                // Sembunyikan seluruh sectionCerita (kotak putih)
                document.getElementById('sectionCerita').style.display = 'none';
                
                // Mulai Visual Novel
                startVisualNovel(hasil);`;

if (js.includes(targetOld)) {
    js = js.replace(targetOld, replaceNew);
} else {
    console.log("Could not find the target old string. Proceeding anyway assuming it might be already replaced.");
}

const vnFunction = `
// ==========================================
// VISUAL NOVEL ENGINE UNTUK EKSPLORASI
// ==========================================
function startVisualNovel(hasil) {
    const vnContainer = document.getElementById('vn-container');
    const vnBg = document.getElementById('vn-bg');
    const vnText = document.getElementById('vn-text');
    const vnClickLayer = document.getElementById('vn-click-layer');
    const vnFairy = document.getElementById('vn-fairy');
    const vnBubble = document.getElementById('vn-bubble');
    const vnHint = document.getElementById('vn-hint');
    const vnBtnMulai = document.getElementById('vn-btn-mulai');
    
    // Siapkan foto background cerita
    let bgCerita = 'url("../shared/assets/bg-supermarket.png")'; // default
    if (hasil.ceritaTerpilih && hasil.ceritaTerpilih.fotoList && hasil.ceritaTerpilih.fotoList.length > 0) {
        bgCerita = 'url("' + hasil.ceritaTerpilih.fotoList[0] + '")';
    }

    // Bangun sekuens cerita
    const storySequence = [
        {
            bg: 'url("aset student/bg-luar-toko.png")', // Gambar luar toko
            text: "Halo Kelompok " + document.getElementById('pilihanKelompok').value + "! Aku adalah Peri Pemandu. Aku membawa misi rahasia untuk kalian!"
        },
        {
            bg: bgCerita, // Ganti background sesuai foto dari guru
            text: "Ini adalah Misi Misteri kalian: " + (hasil.ceritaTerpilih ? hasil.ceritaTerpilih.teks : "Teks Cerita tidak ditemukan.")
        },
        {
            bg: bgCerita,
            text: "Aturan Mainnya: " + (hasil.aturanMain ? hasil.aturanMain : "Tidak ada aturan khusus.")
        },
        {
            bg: bgCerita,
            text: "Dan ini yang paling penting... Kalian diberikan Modal Uang Saku sebesar Rp " + (hasil.uangSakuMisi ? hasil.uangSakuMisi.toLocaleString('id-ID') : "0") + "!"
        },
        {
            bg: bgCerita,
            text: "Pecahkan misinya dan catat belanjaan kalian baik-baik ya. Semoga sukses!"
        }
    ];

    vnContainer.style.display = 'block';

    let currentStep = 0;
    let isTyping = false;
    let typeInterval;
    let currentText = "";

    // Animasi masuk awal
    setTimeout(() => {
        vnFairy.classList.add('show');
        setTimeout(() => {
            vnBubble.classList.add('show');
            loadScene(0);
        }, 800);
    }, 500);

    function loadScene(index) {
        if (index >= storySequence.length) return;
        const scene = storySequence[index];
        vnBg.style.backgroundImage = scene.bg;
        typeText(scene.text);
        
        if (index === storySequence.length - 1) {
            vnHint.style.display = 'none';
        } else {
            vnHint.style.display = 'block';
            vnHint.style.opacity = '0';
        }
    }

    function typeText(text) {
        clearInterval(typeInterval);
        isTyping = true;
        currentText = text;
        vnText.innerHTML = "";
        let i = 0;
        const typeSpeed = 30; 
        typeInterval = setInterval(() => {
            vnText.innerHTML += text.charAt(i);
            i++;
            if (i >= text.length) {
                finishTyping();
            }
        }, typeSpeed);
    }

    function finishTyping() {
        clearInterval(typeInterval);
        isTyping = false;
        vnText.innerHTML = currentText;
        if (currentStep < storySequence.length - 1) {
            vnHint.style.opacity = '1';
        } else {
            vnBtnMulai.style.display = 'block';
            vnClickLayer.style.display = 'none';
        }
    }

    vnClickLayer.addEventListener('click', () => {
        if (typeof playClickSound === 'function') playClickSound();
        if (isTyping) {
            finishTyping();
        } else {
            if (currentStep < storySequence.length - 1) {
                currentStep++;
                loadScene(currentStep);
            }
        }
    });
}
`;

if (!js.includes('VISUAL NOVEL ENGINE UNTUK EKSPLORASI')) {
    fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', js + '\n' + vnFunction);
    console.log("Visual Novel JS injected successfully!");
} else {
    console.log("Visual Novel JS already exists.");
}

