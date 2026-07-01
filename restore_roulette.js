const fs = require('fs');

let code = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');

let newLogic = `
            // Tampilkan Kontainer Roulette & set up DOM
            const rouletteContainer = document.getElementById('rouletteContainer');
            const rouletteTrack = document.getElementById('rouletteTrack');
            rouletteContainer.style.display = 'block';

            // --- ANIMASI ROULETTE ---
            // 1. Ambil semua foto yang tersedia dari cerita lain untuk dijadikan kartu pengecoh
            const storySet = await getStorySettings();
            const allStories = storySet.kumpulanCerita || [];
            let availablePhotos = [];
            allStories.forEach(s => {
                if (s.fotos && s.fotos.length > 0) availablePhotos.push(s.fotos[0]);
            });

            // 2. Isi Track dengan kartu
            rouletteTrack.innerHTML = '';
            const totalCards = 80;
            const winningIndex = 75; // Kartu pemenang ada di urutan ke-75 agar putarannya lama

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
                
                let cardHtml = \`<div class="roulette-card">\`;
                if (photoSrc) {
                    cardHtml += \`<img src="\${photoSrc}">\`;
                } else {
                    const icons = ['🎁', '📦', '🛒', '🛍️', '💎', '💰'];
                    const randomIcon = isWinner ? '🎯' : icons[Math.floor(Math.random() * icons.length)];
                    cardHtml += \`<div class="roulette-card-fallback">\${randomIcon}</div>\`;
                }
                cardHtml += \`</div>\`;
                rouletteTrack.innerHTML += cardHtml;
            }

            // 3. Reset posisi pita ke awal tanpa animasi
            rouletteTrack.style.transition = 'none';
            rouletteTrack.style.transform = 'translateX(0)';
            void rouletteTrack.offsetWidth; // Force reflow agar animasi jalan dari 0

            // 4. Kalkulasi pergeseran
            const containerWidth = rouletteContainer.offsetWidth;
            const cardWidth = 100; // 90px width + 5px margin left + 5px margin right
            const randomOffset = Math.floor(Math.random() * 40) - 20;
            const targetTranslateX = -((winningIndex * cardWidth) + (cardWidth / 2) - (containerWidth / 2) + randomOffset);

            // Putar efek suara Stumble Guys
            const sfxSpin = new Audio('../spin-stumble.mp3'); 
            // Putar audio dari awal
            sfxSpin.currentTime = 0;
            sfxSpin.play().catch(e=>{});

            // 5. Jalankan animasi!
            rouletteTrack.style.transition = 'transform 11.5s cubic-bezier(0.1, 0.9, 0.15, 1)';
            rouletteTrack.style.transform = \`translateX(\${targetTranslateX}px)\`;

            // --- SETELAH ANIMASI SELESAI ---
            setTimeout(() => {
                const fotoCeritaArea = document.getElementById('fotoCeritaArea');
                if (fotoCeritaArea) {
                    fotoCeritaArea.innerHTML = '';
                    if (fotosMisi.length > 0) {
                        fotosMisi.forEach(base64 => {
                            fotoCeritaArea.innerHTML += \`<img src="\${base64}" style="width:100%; height:auto; border-radius:10px; border:2px solid #00FFFF; box-shadow:0 0 15px rgba(0,255,255,0.5);">\`;
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
                
                // KITA HAPUS TRANSISI LAMBAT/DELAY SAAT KARTU MUNCUL
                hasilCeritaArea.classList.remove('stumble-transition');
                
                const sfxWin = new Audio('../benar.mp3');
                sfxWin.play().catch(e=>{});

                if (typeof createParticles === 'function') {
                    createParticles();
                }
            }, 12000); // Tunggu sampai putaran selesai (11.5s) lalu langsung munculkan hasil
`;


let startMarker = "localStorage.setItem('genderCerita', genderMisi);";
let endMarker = "if (typeof createParticles === 'function') {";

let startIndex = code.indexOf(startMarker);
let endIndex = code.indexOf("        });", code.indexOf(endMarker)); 

if (startIndex !== -1 && endIndex !== -1) {
    let finalCode = code.substring(0, startIndex + startMarker.length) + "\\n" + newLogic + code.substring(endIndex);
    fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', finalCode);
    console.log("Restored roulette successfully!");
} else {
    console.log("Could not find markers!");
}
