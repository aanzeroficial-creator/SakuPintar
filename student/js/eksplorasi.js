

document.addEventListener('DOMContentLoaded', async () => {
    
    const btnSubmit = document.querySelector('#formEksplorasi button');
    if (btnSubmit) btnSubmit.textContent = "Memuat...";

    
    
    
    const btnForceLandscape = document.getElementById('btnForceLandscape');
    const rotateOverlay = document.getElementById('landscape-warning');
    
    async function forceLandscapeMode() {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                await document.documentElement.webkitRequestFullscreen();
            }
            if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape');
            }
        } catch (e) {
            console.log("Auto-rotate gagal:", e);
            if (window.innerHeight > window.innerWidth) {
                const overlayText = rotateOverlay.querySelector('h2');
                const overlayDesc = rotateOverlay.querySelector('p');
                if (overlayText && overlayDesc) {
                    overlayText.innerHTML = "Gagal Memutar Layar 🔒";
                    overlayDesc.innerHTML = "Sistem HP Anda memblokir rotasi otomatis. <b>Matikan fitur 'Kunci Orientasi' di pengaturan HP Anda</b>, lalu putar HP secara manual!";
                }
                if (btnForceLandscape) btnForceLandscape.style.display = 'none';
            }
        }
    }

    if(btnForceLandscape) {
        btnForceLandscape.addEventListener('click', forceLandscapeMode);
    }
    
    
    
    
    const tabCerita = document.getElementById('tabCerita');
    const tabFoto = document.getElementById('tabFoto');
    const btnLanjutFoto = document.getElementById('btnLanjutFoto');
    const secCerita = document.getElementById('sectionCerita');
    const secFoto = document.getElementById('sectionFoto');
    const secGaleri = document.getElementById('sectionGaleri');

    function switchToFoto() {
        if(tabCerita) tabCerita.classList.remove('active');
        if(tabFoto) tabFoto.classList.add('active');
        if(secCerita) secCerita.style.display = 'none';
        if(secFoto) secFoto.style.display = 'block';
        if(secGaleri) secGaleri.style.display = 'block';
        window.scrollTo(0, 0);
    }

    function switchToCerita() {
        if(tabFoto) tabFoto.classList.remove('active');
        if(tabCerita) tabCerita.classList.add('active');
        if(secFoto) secFoto.style.display = 'none';
        if(secGaleri) secGaleri.style.display = 'none';
        if(secCerita) secCerita.style.display = 'block';
        window.scrollTo(0, 0);
    }

    if (tabCerita && tabFoto) {
        tabCerita.addEventListener('click', switchToCerita);
        tabFoto.addEventListener('click', switchToFoto);
        if (btnLanjutFoto) btnLanjutFoto.addEventListener('click', switchToFoto);
    }

    
    
    
    let currentStorySettings = null;

    if (typeof listenToStorySettings === 'function') {
        listenToStorySettings((storyData) => {
            currentStorySettings = storyData;
            const teksAturan = document.getElementById('teksAturan');
            const pilihanKelompok = document.getElementById('pilihanKelompok');
            
            if(teksAturan) teksAturan.textContent = storyData.aturan;
            
            
            if (pilihanKelompok && pilihanKelompok.options.length <= 1) {
                const jumlah = storyData.jumlahKelompok || 1;
                for (let i = 1; i <= jumlah; i++) {
                    const opt = document.createElement('option');
                    opt.value = i;
                    opt.textContent = "Kelompok " + i;
                    pilihanKelompok.appendChild(opt);
                }
            }
        });
    }

    
    
    
    const btnAcakCerita = document.getElementById('btnAcakCerita');
    const pilihKelompokArea = document.getElementById('pilihKelompokArea');
    const hasilCeritaArea = document.getElementById('hasilCeritaArea');

    if (btnAcakCerita) {
        btnAcakCerita.addEventListener('click', async () => {
            const pilihanKelompok = document.getElementById('pilihanKelompok');
            if (!pilihanKelompok.value) {
                alert("Pilih nomor kelompokmu dulu ya!");
                return;
            }

            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    await document.documentElement.webkitRequestFullscreen();
                }
                if (screen.orientation && screen.orientation.lock) {
                    await screen.orientation.lock('landscape');
                }
            } catch (err) {
                console.log("Auto-rotate gagal:", err);
            }

            const kelompokId = parseInt(pilihanKelompok.value);
            btnAcakCerita.textContent = "Mengacak Misi... 🎲";
            btnAcakCerita.disabled = true;
            pilihanKelompok.disabled = true;

            const rouletteContainer = document.getElementById('rouletteContainer');
            const rouletteTrack = document.getElementById('rouletteTrack');
            if(rouletteContainer) rouletteContainer.style.display = 'block';

            let hasil = { cerita: null };
            if (typeof drawRandomStory === 'function') {
                hasil = await drawRandomStory(kelompokId);
            }
            
            let teksMisi = "";
            let uangSakuMisi = 20000;
            let genderMisi = "L";
            let fotosMisi = [];

            if (!hasil || !hasil.cerita) {
                teksMisi = "Guru belum memberikan Misi Misteri. Tanyakan pada gurumu ya!";
            } else if (typeof hasil.cerita === 'object' && hasil.cerita !== null) {
                teksMisi = hasil.cerita.teks || "Teks cerita kosong.";
                uangSakuMisi = parseInt(hasil.cerita.uangSaku) || 20000;
                genderMisi = hasil.cerita.gender || "L";
                fotosMisi = hasil.cerita.fotos || [];
            } else {
                teksMisi = hasil.cerita || "Teks cerita kosong.";
            }

            
            localStorage.setItem('teksMisiCerita', teksMisi);
            localStorage.setItem('uangSakuMisi', uangSakuMisi);
            localStorage.setItem('uangSakuCerita', uangSakuMisi.toString());
            localStorage.setItem('fotosMisiCerita', JSON.stringify(fotosMisi));
            localStorage.setItem('aturanMisiCerita', currentStorySettings ? currentStorySettings.aturan : "Tidak ada aturan khusus.");
            localStorage.setItem('kelompokMisiCerita', pilihanKelompok.value);
            localStorage.setItem('genderCerita', genderMisi);

            
            let availablePhotos = [];
            if (currentStorySettings && currentStorySettings.kumpulanCerita) {
                currentStorySettings.kumpulanCerita.forEach(s => {
                    if (s.fotos && s.fotos.length > 0) availablePhotos.push(s.fotos[0]);
                });
            }

            if(rouletteTrack) {
                rouletteTrack.innerHTML = '';
                const totalCards = 80;
                const winningIndex = 75; 

                for (let i = 0; i < totalCards; i++) {
                    let photoSrc = "";
                    let isWinner = (i === winningIndex);
                    
                    if (isWinner) {
                        photoSrc = fotosMisi.length > 0 ? fotosMisi[0] : "";
                    } else {
                        if (availablePhotos.length > 0) {
                            photoSrc = availablePhotos[Math.floor(Math.random() * availablePhotos.length)];
                        }
                    }
                    
                    let cardHtml = `<div class="roulette-card">`;
                    if (photoSrc) {
                        cardHtml += `<img src="${photoSrc}">`;
                    } else {
                        const icons = ['🎁', '📦', '🛒', '🛍️', '💎', '💰'];
                        const randomIcon = isWinner ? '🎯' : icons[Math.floor(Math.random() * icons.length)];
                        cardHtml += `<div class="roulette-card-fallback">${randomIcon}</div>`;
                    }
                    cardHtml += `</div>`;
                    rouletteTrack.innerHTML += cardHtml;
                }

                rouletteTrack.style.transition = 'none';
                rouletteTrack.style.transform = 'translateX(0)';
                void rouletteTrack.offsetWidth; 

                const containerWidth = rouletteContainer.offsetWidth;
                const cardWidth = 100;
                const randomOffset = Math.floor(Math.random() * 40) - 20;
                const targetTranslateX = -((winningIndex * cardWidth) + (cardWidth / 2) - (containerWidth / 2) + randomOffset);

                const sfxSpin = new Audio('../spin-stumble.mp3'); 
                sfxSpin.currentTime = 0;
                sfxSpin.play().catch(e=>{});

                rouletteTrack.style.transition = 'transform 11.5s cubic-bezier(0.1, 0.9, 0.15, 1)';
                rouletteTrack.style.transform = `translateX(${targetTranslateX}px)`;
            }

            
            setTimeout(() => {
                const fotoCeritaArea = document.getElementById('fotoCeritaArea');
                if (fotoCeritaArea) {
                    fotoCeritaArea.innerHTML = '';
                    if (fotosMisi.length > 0) {
                        fotosMisi.forEach(base64 => {
                            fotoCeritaArea.innerHTML += `<img src="${base64}" style="width:100%; height:auto; border-radius:10px; border:2px solid #3498DB; box-shadow:0 4px 10px rgba(0,0,0,0.1);">`;
                        });
                        fotoCeritaArea.style.display = 'grid';
                    } else {
                        fotoCeritaArea.style.display = 'none';
                    }
                }

                const teksCerita = document.getElementById('teksCerita');
                if(teksCerita) teksCerita.textContent = teksMisi;
                
                const infoUangSakuMisi = document.getElementById('infoUangSakuMisi');
                if(infoUangSakuMisi && typeof formatRupiah === 'function') {
                    infoUangSakuMisi.textContent = formatRupiah(uangSakuMisi);
                } else if (infoUangSakuMisi) {
                    infoUangSakuMisi.textContent = "Rp " + uangSakuMisi.toLocaleString('id-ID');
                }

                if(pilihKelompokArea) pilihKelompokArea.style.display = 'none';
                if(hasilCeritaArea) hasilCeritaArea.style.display = 'block';
                const secCerita = document.getElementById('sectionCerita');
                if(secCerita) secCerita.style.display = 'block';
                
                if (hasil && hasil.baruSajaDiundi) {
                    const sfxWin = new Audio('../benar.mp3');
                    sfxWin.play().catch(e=>{});
                }
                
                if (typeof createParticles === 'function') {
                    createParticles();
                }
            }, 12000); 
        });
    }
});

function createParticles() {
    const particleCount = 150; 
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '&#9733;';
        particle.style.position = 'fixed';
        particle.style.zIndex = '99999999'; 
        particle.style.fontSize = (Math.random() * 30 + 12) + 'px';
        particle.style.fontWeight = 'bold';
        const colors = ['#FFFFFF', '#FFD700', '#FFFF00', '#00FFFF', '#FF69B4', '#39FF14', '#FF5F1F']; 
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.color = color;
        
        particle.style.textShadow = `0 0 5px #FFF, 0 0 12px ${color}, 0 0 25px ${color}, 0 0 40px ${color}`;
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.pointerEvents = 'none';
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const maxVelocity = Math.max(window.innerWidth, window.innerHeight) * 0.8;
        const velocity = 100 + Math.random() * maxVelocity;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.animate([
            { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.6) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: 1500 + Math.random() * 2500,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
        }).onfinish = () => particle.remove();
    }
}