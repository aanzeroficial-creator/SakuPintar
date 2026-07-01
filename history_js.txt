document.addEventListener('DOMContentLoaded', () => {
    
    // Logika Fullscreen (seperti sebelumnya)
    const btnForceLandscape = document.getElementById('btnForceLandscape');
    if (btnForceLandscape) {
        btnForceLandscape.addEventListener('click', () => {
            if (typeof playClickSound === 'function') playClickSound();
            const docElm = document.documentElement;
            if (docElm.requestFullscreen) docElm.requestFullscreen();
            else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen();
            else if (docElm.webkitRequestFullScreen) docElm.webkitRequestFullScreen();
            else if (docElm.msRequestFullscreen) docElm.msRequestFullscreen();

            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(function(error) {
                    console.log("Kunci orientasi gagal:", error);
                });
            }
        });
    }

    // --- VISUAL NOVEL ENGINE ---
    
    const storySequence = [
        {
            bg: 'url("aset student/bg-luar-toko.png")',
            text: "Halo semuanya! Selamat datang di Toko Saku Pintar! Aku adalah Peri Pemandu yang akan menemanimu berbelanja hari ini."
        },
        {
            bg: 'url("aset student/bg-luar-toko.png")',
            text: "Sebelum masuk, ingatlah petunjuk penting ini: Pilihlah barang sesuai dengan jumlah uang saku yang kamu miliki."
        },
        {
            bg: 'url("../shared/assets/bg-supermarket.png")',
            text: "Wah, banyak sekali barangnya! Buatlah catatan pembelianmu dengan cermat berdasarkan barang yang benar-benar dibutuhkan ya."
        },
        {
            bg: 'url("../shared/assets/bg-supermarket.png")',
            text: "Peringatan penting: Jangan langsung pergi ke meja kasir! Kamu harus berkeliling menuju etalase toko untuk mengeklik dan memilih barang terlebih dahulu."
        },
        {
            bg: 'url("../shared/assets/bg-supermarket.png")',
            text: "Apakah kamu sudah siap? Jika sudah siap, mari kita mulai petualangan belanja ini!"
        }
    ];

    let currentStep = 0;
    let isTyping = false;
    let typeInterval;
    let currentText = "";

    const gameBg = document.getElementById('game-bg');
    const dialogueText = document.getElementById('dialogue-text');
    const clickLayer = document.getElementById('click-layer');
    const fairyContainer = document.getElementById('fairy-container');
    const speechBubble = document.getElementById('speech-bubble');
    const continueHint = document.getElementById('continue-hint');
    const btnMulai = document.getElementById('btn-mulai');

    // Animasi masuk awal
    setTimeout(() => {
        fairyContainer.classList.add('show');
        setTimeout(() => {
            speechBubble.classList.add('show');
            loadScene(0);
        }, 800);
    }, 500);

    function loadScene(index) {
        if (index >= storySequence.length) return;
        
        const scene = storySequence[index];
        
        // Ubah background
        gameBg.style.backgroundImage = scene.bg;

        // Mulai ketik
        typeText(scene.text);
        
        // Sembunyikan tombol mulai jika belum di akhir
        if (index === storySequence.length - 1) {
            continueHint.style.display = 'none';
        } else {
            continueHint.style.display = 'block';
            continueHint.style.opacity = '0'; // Sembunyikan hint saat sedang mengetik
        }
    }

    function typeText(text) {
        clearInterval(typeInterval);
        isTyping = true;
        currentText = text;
        dialogueText.innerHTML = "";
        
        let i = 0;
        // Kecepatan ketik (ms)
        const typeSpeed = 30; 

        // Mainkan efek suara ngomong (opsional)
        // Jika ada sound khusus peri, bisa diputar di sini secara berulang, tapi kita pakai click sound sebagai dummy kalau mau.
        
        typeInterval = setInterval(() => {
            dialogueText.innerHTML += text.charAt(i);
            i++;
            if (i >= text.length) {
                finishTyping();
            }
        }, typeSpeed);
    }

    function finishTyping() {
        clearInterval(typeInterval);
        isTyping = false;
        dialogueText.innerHTML = currentText; // Pastikan teks penuh
        
        // Munculkan hint klik
        if (currentStep < storySequence.length - 1) {
            continueHint.style.opacity = '1';
        } else {
            // Tampilkan tombol mulai belanja
            btnMulai.style.display = 'block';
            clickLayer.style.display = 'none'; // Matikan click layer agar tombol bisa diklik
        }
    }

    // Interaksi Klik Layar
    clickLayer.addEventListener('click', () => {
        if (typeof playClickSound === 'function') playClickSound();
        
        if (isTyping) {
            // Jika sedang ngetik, langsung selesaikan
            finishTyping();
        } else {
            // Jika sudah selesai ngetik, lanjut ke scene berikutnya
            if (currentStep < storySequence.length - 1) {
                currentStep++;
                loadScene(currentStep);
            }
        }
    });

});