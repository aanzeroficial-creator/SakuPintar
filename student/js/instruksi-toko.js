document.addEventListener('DOMContentLoaded', () => {
    
    
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
        
        
        gameBg.style.backgroundImage = scene.bg;
        
        const mockUI = document.getElementById('mock-ui');
        const mockRak = document.getElementById('mock-rak');
        const mockRakInd = document.getElementById('mock-rak-indicator');
        const mockKasir = document.getElementById('mock-kasir');
        const mockKasirCross = document.getElementById('mock-kasir-cross');
        const overlayBg = document.querySelector('.overlay-bg');
        
        if (mockUI) {
            
            if (index >= 2) {
                mockUI.style.opacity = '1';
                overlayBg.style.background = 'rgba(0, 0, 0, 0.7)'; 
            } else {
                mockUI.style.opacity = '0';
                overlayBg.style.background = 'rgba(0, 0, 0, 0.4)';
            }

            
            if (index === 3) {
                mockRak.style.transform = 'scale(1.2)';
                mockRak.style.boxShadow = '0 0 30px #F1C40F';
                mockRakInd.style.opacity = '1';
                
                mockKasir.style.filter = 'grayscale(100%) brightness(50%)';
                mockKasirCross.style.opacity = '1';
            } else {
                mockRak.style.transform = 'scale(1)';
                mockRak.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
                mockRakInd.style.opacity = '0';
                
                mockKasir.style.filter = 'none';
                mockKasirCross.style.opacity = '0';
            }
        }


        
        typeText(scene.text);
        
        
        if (index === storySequence.length - 1) {
            continueHint.style.display = 'none';
        } else {
            continueHint.style.display = 'block';
            continueHint.style.opacity = '0'; 
        }
    }

    function typeText(text) {
        clearInterval(typeInterval);
        isTyping = true;
        currentText = text;
        dialogueText.innerHTML = "";
        
        let i = 0;
        
        const typeSpeed = 30; 

        
        
        
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
        dialogueText.innerHTML = currentText; 
        
        
        if (currentStep < storySequence.length - 1) {
            continueHint.style.opacity = '1';
        } else {
            
            btnMulai.style.display = 'block';
            clickLayer.style.display = 'none'; 
        }
    }

    
    clickLayer.addEventListener('click', () => {
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

});
