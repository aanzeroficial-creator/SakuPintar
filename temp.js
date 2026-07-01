

document.addEventListener('DOMContentLoaded', async () => {
    const formEksplorasi = document.getElementById('formEksplorasi');
    const limitInfo = document.getElementById('limitInfo');
    const btnSubmit = formEksplorasi ? formEksplorasi.querySelector('button') : null;
    
    
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
            console.log("Auto-rotate gagal/ditolak oleh browser:", e);
            
            
            if (window.innerHeight > window.innerWidth) {
                const overlayText = rotateOverlay.querySelector('h2');
                const overlayDesc = rotateOverlay.querySelector('p');
                
                if (overlayText && overlayDesc) {
                    overlayText.innerHTML = "Gagal Memutar Layar 🔒";
                    overlayDesc.innerHTML = "Sistem HP Anda memblokir rotasi otomatis. <b>Tolong matikan fitur 'Kunci Orientasi' (Rotation Lock) di pengaturan HP Anda</b>, lalu putar HP secara manual ke mode miring!";
                }
                
                if (btnForceLandscape) {
                    btnForceLandscape.style.display = 'none'; 
                }
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
        tabCerita.classList.remove('active');
        tabFoto.classList.add('active');
        secCerita.style.display = 'none';
        secFoto.style.display = 'block';
        if (secGaleri) secGaleri.style.display = 'block';
        window.scrollTo(0, 0);
    }

    function switchToCerita() {
        tabFoto.classList.remove('active');
        tabCerita.classList.add('active');
        secFoto.style.display = 'none';
        if (secGaleri) secGaleri.style.display = 'none';
        secCerita.style.display = 'block';
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
                } else if (document.documentElement.msRequestFullscreen) { 
                    await document.documentElement.msRequestFullscreen();
                }
                
                
                if (screen.orientation && screen.orientation.lock) {
                    await screen.orientation.lock('landscape');
                }
            } catch (err) {
                console.log("Auto-rotate/Fullscreen gagal atau tidak didukung browser:", err);
            }

            const kelompokId = parseInt(pilihanKelompok.value);
            btnAcakCerita.textContent = "Mengacak Misi... 🎲";
            btnAcakCerita.disabled = true;
            pilihanKelompok.disabled = true;

            
            const rouletteContainer = document.getElementById('rouletteContainer');
            const rouletteTrack = document.getElementById('rouletteTrack');
            rouletteContainer.style.display = 'block';

            
            const hasil = await drawRandomStory(kelompokId);
            
            let teksMisi = "";
            let uangSakuMisi = 20000;
            let genderMisi = "L";
            let fotosMisi = [];

            if (typeof hasil.cerita === 'object' && hasil.cerita !== null) {
                teksMisi = hasil.cerita.teks || "";
                uangSakuMisi = parseInt(hasil.cerita.uangSaku) || 20000;
                genderMisi = hasil.cerita.gender || "L";
                fotosMisi = hasil.cerita.fotos || [];
            } else {
                teksMisi = hasil.cerita || "";
            }

            
            localStorage.setItem('uangSakuCerita', uangSakuMisi.toString());
            localStorage.setItem('genderCerita', genderMisi);

            
            
            
            
            if(rouletteContainer) rouletteContainer.style.display = 'none';

            
            const fotoCeritaArea = document.getElementById('fotoCeritaArea');
            if (fotoCeritaArea) {
                fotoCeritaArea.innerHTML = '';
                if (fotosMisi.length > 0) {
                    fotosMisi.forEach(base64 => {
                        fotoCeritaArea.innerHTML += `<img src="${base64}" style="width:100%; height:auto; border-radius:10px; border:2px solid #00FFFF; box-shadow:0 0 15px rgba(0,255,255,0.5);">`;
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

            
            pilihKelompokArea.style.display = 'none';
            hasilCeritaArea.style.display = 'block';
            hasilCeritaArea.classList.remove('stumble-transition'); 
            
            
            const sfxWin = new Audio('../benar.mp3');
            sfxWin.play().catch(e=>{});

            
            createParticles();


document.addEventListener('DOMContentLoaded', async () => {
    const formEksplorasi = document.getElementById('formEksplorasi');
    const limitInfo = document.getElementById('limitInfo');
    const btnSubmit = formEksplorasi ? formEksplorasi.querySelector('button') : null;
    
    
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
            console.log("Auto-rotate gagal/ditolak oleh browser:", e);
            
            
            if (window.innerHeight > window.innerWidth) {
                const overlayText = rotateOverlay.querySelector('h2');
                const overlayDesc = rotateOverlay.querySelector('p');
                
                if (overlayText && overlayDesc) {
                    overlayText.innerHTML = "Gagal Memutar Layar 🔒";
                    overlayDesc.innerHTML = "Sistem HP Anda memblokir rotasi otomatis. <b>Tolong matikan fitur 'Kunci Orientasi' (Rotation Lock) di pengaturan HP Anda</b>, lalu putar HP secara manual ke mode miring!";
                }
                
                if (btnForceLandscape) {
                    btnForceLandscape.style.display = 'none'; 
                }
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
        tabCerita.classList.remove('active');
        tabFoto.classList.add('active');
        secCerita.style.display = 'none';
        secFoto.style.display = 'block';
        if (secGaleri) secGaleri.style.display = 'block';
        window.scrollTo(0, 0);
    }

    function switchToCerita() {
        tabFoto.classList.remove('active');
        tabCerita.classList.add('active');
        secFoto.style.display = 'none';
        if (secGaleri) secGaleri.style.display = 'none';
        secCerita.style.display = 'block';
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
                } else if (document.documentElement.msRequestFullscreen) { 
                    await document.documentElement.msRequestFullscreen();
                }
                
                
                if (screen.orientation && screen.orientation.lock) {
                    await screen.orientation.lock('landscape');
                }
            } catch (err) {
                console.log("Auto-rotate/Fullscreen gagal atau tidak didukung browser:", err);
            }

            const kelompokId = parseInt(pilihanKelompok.value);
            btnAcakCerita.textContent = "Mengacak Misi... 🎲";
            btnAcakCerita.disabled = true;
            pilihanKelompok.disabled = true;

            
            const rouletteContainer = document.getElementById('rouletteContainer');
            const rouletteTrack = document.getElementById('rouletteTrack');
            rouletteContainer.style.display = 'block';

            
            const hasil = await drawRandomStory(kelompokId);
            
            let teksMisi = "";
            let uangSakuMisi = 20000;
            let genderMisi = "L";
            let fotosMisi = [];

            if (typeof hasil.cerita === 'object' && hasil.cerita !== null) {
                teksMisi = hasil.cerita.teks || "";
                uangSakuMisi = parseInt(hasil.cerita.uangSaku) || 20000;
                genderMisi = hasil.cerita.gender || "L";
                fotosMisi = hasil.cerita.fotos || [];
            } else {
                teksMisi = hasil.cerita || "";
            }

            
            localStorage.setItem('uangSakuCerita', uangSakuMisi.toString());
            localStorage.setItem('genderCerita', genderMisi);

            
            
            if(rouletteContainer) rouletteContainer.style.display = 'none';

            const fotoCeritaArea = document.getElementById('fotoCeritaArea');
            if (fotoCeritaArea) {
                fotoCeritaArea.innerHTML = '';
                if (fotosMisi.length > 0) {
                    fotosMisi.forEach(base64 => {
                        fotoCeritaArea.innerHTML += `<img src="${base64}" style="width:100%; height:auto; border-radius:10px; border:2px solid #00FFFF; box-shadow:0 0 15px rgba(0,255,255,0.5);">`;
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

            pilihKelompokArea.style.display = 'none';
            hasilCeritaArea.style.display = 'block';
            hasilCeritaArea.classList.remove('stumble-transition');
            
            const sfxWin = new Audio('../benar.mp3');
            sfxWin.play().catch(e=>{});

            if (typeof createParticles === 'function') {
                createParticles();
            }
        });
    }
});

function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.zIndex = '999999';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'][Math.floor(Math.random() * 6)];
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.boxShadow = '0 0 10px ' + particle.style.background;
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 150;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => particle.remove();
    }
    }
}
}
});
});