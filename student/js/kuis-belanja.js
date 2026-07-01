document.addEventListener('DOMContentLoaded', async () => {

    if (window.audios) {
        if (window.audios.bgm) {
            const targetBgm = '../backsound kuis.mp3';
            const tempBgm = new Audio(targetBgm);
            if (window.audios.bgm.src !== tempBgm.src) {
                window.audios.bgm.src = targetBgm;
                window.audios.bgm.load();
            }
        }
        if (window.audios.click) {
            const targetClick = '../klik kuis.mp3';
            const tempClick = new Audio(targetClick);
            if (window.audios.click.src !== tempClick.src) {
                window.audios.click.src = targetClick;
                window.audios.click.load();
            }
        }
    }


    const budgetDisplay = document.getElementById('budgetDisplay');
    const btnBukaRak = document.getElementById('btnBukaRak');
    const modalRak = document.getElementById('modalRak');
    const btnTutupRak = document.getElementById('btnTutupRak');
    const shopTabsContainer = document.getElementById('shopTabsContainer');
    const rakBarangGrid = document.getElementById('rakBarangGrid');

    const pertanyaanKasir = document.getElementById('pertanyaanKasir');
    const uangTerkumpulDisplay = document.getElementById('uangTerkumpulDisplay');
    const btnResetUang = document.getElementById('btnResetUang');
    const btnBayar = document.getElementById('btnBayar');
    const keranjangVisual = document.getElementById('keranjangVisual');
    const feedbackToast = document.getElementById('feedbackToast');


    const btnRaksasaRak = document.getElementById('btnRaksasaRak');
    const panelPilihBarang = document.getElementById('panelPilihBarang');
    const areaKiri = document.querySelector('.area-kiri');
    const areaKanan = document.querySelector('.area-kanan');

    let uangSaku = 0;
    let uangTerkumpul = 0;
    let allItems = [];
    let currentShop = 'all';
    let selectedItemForBuy = null;


    let saldoAwal = 0;
    let daftarBelanjaan = [];
    let sisaWaktu = 120;
    if (typeof window.getSettings === 'function') {
        try {
            const settings = await window.getSettings();
            if (settings && settings.waktuKuis) {
                sisaWaktu = settings.waktuKuis;
                const m = Math.floor(sisaWaktu / 60).toString().padStart(2, '0');
                const s = (sisaWaktu % 60).toString().padStart(2, '0');
                const timerEl = document.getElementById('timerDisplay');
                if (timerEl) {
                    timerEl.textContent = `⏱️ ${m}:${s}`;
                }
            }
        } catch (e) {
            console.error("Gagal memuat waktu dari server:", e);
        }
    }
    let timerInterval = null;
    let isGameEnded = false;
    let storySettings = null;
    let nilai = 0;
    let benarCount = 0;
    let salahCount = 0;
    let totalKebutuhan = 0;


    const timerDisplay = document.getElementById('timerDisplay');
    const btnSelesaiBelanja = document.getElementById('btnSelesaiBelanja');
    const areaGame = document.querySelector('.game-area');
    const headerGame = document.querySelector('.game-header');
    const sectionEvaluasi = document.getElementById('evaluasi-belanja');
    const evalSaldoAwal = document.getElementById('evalSaldoAwal');
    const evalSisaSaldo = document.getElementById('evalSisaSaldo');
    const evalTabelBody = document.getElementById('evalTabelBody');
    const teksSisaUang = document.getElementById('teksSisaUang');
    const inputPerencanaan = document.getElementById('inputPerencanaan');
    const btnSimpanEvaluasi = document.getElementById('btnSimpanEvaluasi');
    const btnTutupEvaluasi = document.getElementById('btnTutupEvaluasi');


    const sfxKoin = new Audio('../klik kuis.mp3');
    const sfxBenar = new Audio('../benar.mp3');
    const sfxSalah = new Audio('../salah.mp3');
    const sfxSelesai = new Audio('../u_o8xh7gwsrj-cute_happy_victory-476376.mp3');


    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
    }

    function showFeedback(message, isSuccess) {
        feedbackToast.textContent = message;
        feedbackToast.style.background = isSuccess ? '#27AE60' : '#E74C3C';
        feedbackToast.style.display = 'block';

        if (isSuccess) sfxBenar.play().catch(e => { });
        else sfxSalah.play().catch(e => { });

        setTimeout(() => {
            feedbackToast.style.display = 'none';
        }, 3000);
    }

    function updateWalletUI() {
        const formatted = formatRupiah(uangSaku);
        if (budgetDisplay) budgetDisplay.textContent = formatted;


        const modalBudgetDisplay = document.getElementById('modalBudgetDisplay');
        if (modalBudgetDisplay) modalBudgetDisplay.textContent = formatted;
    }

    function updateCashierUI() {
        uangTerkumpulDisplay.textContent = uangTerkumpul;
    }


    async function initData() {
        try {

            if (typeof getStorySettings === 'function') {
                storySettings = await getStorySettings();
            }

            const savedUangSaku = localStorage.getItem('uangSakuCerita') || localStorage.getItem('uangSakuMisi');

            if (savedUangSaku) {
                uangSaku = parseInt(savedUangSaku);
            } else if (storySettings) {
                uangSaku = storySettings.uangSakuAwal || 20000;
            } else {
                uangSaku = 20000;
            }

            saldoAwal = uangSaku;
            updateWalletUI();

            if (typeof getAllItems === 'function') {
                const fetchedItems = await getAllItems();
                allItems = fetchedItems.filter(item => item.uploader === 'guru');
            }

            renderShopTabs();
            renderItemsGrid();

        } catch (error) {
            console.error("Gagal memuat data:", error);
            rakBarangGrid.innerHTML = '<p style="color:red; text-align:center;">Gagal memuat data toko.</p>';
        }
    }


    if (btnBukaRak && panelPilihBarang) btnBukaRak.style.display = 'none';
    if (btnResetUang && panelPilihBarang) btnResetUang.style.display = 'none';
    if (btnBayar && panelPilihBarang) btnBayar.style.display = 'none';

    if (btnBukaRak) {
        btnBukaRak.addEventListener('click', () => {
            modalRak.style.display = 'flex';
            if (window.setMuteStatus) window.setMuteStatus(false);
            else if (window.playBGM) window.playBGM();
        });
    }
    if (btnTutupRak) {
        btnTutupRak.addEventListener('click', () => { modalRak.style.display = 'none'; });
    }
    if (btnRaksasaRak) {
        btnRaksasaRak.addEventListener('click', () => {
            modalRak.style.display = 'flex';
            if (window.setMuteStatus) window.setMuteStatus(false);
            else if (window.playBGM) window.playBGM();
        });
    }

    function renderShopTabs() {
        const uniqueShops = [...new Set(allItems.map(item => item.toko || 'Toko Umum'))];
        shopTabsContainer.innerHTML = '<div class="shop-tab active" data-shop="all">Semua Toko</div>';

        uniqueShops.forEach(shopName => {
            const tab = document.createElement('div');
            tab.className = 'shop-tab';
            tab.setAttribute('data-shop', shopName);
            tab.textContent = `🏪 ${shopName}`;
            shopTabsContainer.appendChild(tab);
        });

        const tabs = shopTabsContainer.querySelectorAll('.shop-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                currentShop = e.target.getAttribute('data-shop');
                renderItemsGrid();
            });
        });
    }

    function renderItemsGrid() {
        rakBarangGrid.innerHTML = '';
        let filteredItems = currentShop === 'all' ? allItems : allItems.filter(item => (item.toko || 'Toko Umum') === currentShop);

        if (filteredItems.length === 0) {
            rakBarangGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #7F8C8D; padding: 20px;">Toko ini kosong.</p>`;
            return;
        }

        filteredItems.forEach((item) => {
            if (typeof item.jumlahPilihan === 'undefined') item.jumlahPilihan = 0;

            const card = document.createElement('div');
            card.className = 'item-card';

            const imgSrc = item.fotoBase64 || '../aset student/dompet.png';
            card.innerHTML = `
                <img src="${imgSrc}" class="item-img" alt="${item.nama}">
                <div class="item-name">${item.nama}</div>
                <div class="item-price">${formatRupiah(item.harga)}</div>
                
                <div style="margin: 10px 0; display:flex; align-items:center; justify-content:center; gap:10px;">
                    <button class="btn-min" style="width:30px; height:30px; border-radius:5px; border:none; background:#E74C3C; color:white; font-weight:bold; cursor:pointer;">-</button>
                    <span class="qty-display" style="font-size:1.2rem; font-weight:bold;">${item.jumlahPilihan}</span>
                    <button class="btn-plus" style="width:30px; height:30px; border-radius:5px; border:none; background:#2ECC71; color:white; font-weight:bold; cursor:pointer;">+</button>
                </div>
            `;

            const btnMin = card.querySelector('.btn-min');
            const btnPlus = card.querySelector('.btn-plus');
            const qtyDisplay = card.querySelector('.qty-display');

            btnMin.addEventListener('click', (e) => {
                e.stopPropagation();
                if (item.jumlahPilihan > 0) {
                    item.jumlahPilihan--;
                    qtyDisplay.textContent = item.jumlahPilihan;
                }
            });

            btnPlus.addEventListener('click', (e) => {
                e.stopPropagation();
                item.jumlahPilihan++;
                qtyDisplay.textContent = item.jumlahPilihan;
            });

            rakBarangGrid.appendChild(card);
        });
    }

    const btnMulaiBermain = document.getElementById('btnMulaiBermain');
    const barangAtasKasir = document.getElementById('barangAtasKasir');
    let currentCheckoutIndex = 0;

    if (btnMulaiBermain) {
        btnMulaiBermain.addEventListener('click', () => {

            keranjangPilihan = allItems.filter(item => item.jumlahPilihan > 0).map(item => ({ ...item, jumlah: item.jumlahPilihan }));

            if (keranjangPilihan.length === 0) {
                Swal.fire({
                    title: 'Keranjang Kosong!',
                    text: 'Pilih minimal 1 barang terlebih dahulu!',
                    icon: 'warning',
                    confirmButtonColor: '#F39C12'
                });
                return;
            }

            currentCheckoutIndex = 0;
            modalRak.style.display = 'none';


            if (panelPilihBarang) panelPilihBarang.style.display = 'none';
            if (btnResetUang) btnResetUang.style.display = 'block';
            if (btnBayar) btnBayar.style.display = 'block';

            const panelDompet = document.getElementById('panelDompet');
            if (panelDompet) {
                panelDompet.style.display = 'block';
                setTimeout(() => {
                    panelDompet.style.opacity = '1';
                    panelDompet.style.transform = 'scale(1)';
                }, 50);
            }


            if (btnBukaRak) btnBukaRak.style.display = 'none';
            if (btnSelesaiBelanja && window.innerWidth > 600) {
                const headerLeft = document.querySelector('.header-left');
                if (headerLeft) headerLeft.appendChild(btnSelesaiBelanja);
            }



            btnBukaRak.style.display = 'none';

            renderPercakapanKasir();

            uangTerkumpul = 0;
            updateCashierUI();


            if (window.setMuteStatus) {
                window.setMuteStatus(false);
            } else if (window.playBGM) {
                window.playBGM();
            } else if (window.audios && window.audios.bgm) {
                window.audios.bgm.play().catch(e => console.log("Gagal memutar BGM:", e));
            }

            mulaiTimer();
        });
    }


    window.renderPercakapanKasir = function () {
        if (!keranjangPilihan || keranjangPilihan.length === 0 || currentCheckoutIndex >= keranjangPilihan.length) {
            pertanyaanKasir.innerHTML = `Semua barang yang kamu pilih sudah selesai dibayar. Terima kasih!`;
            return;
        }

        const currentItem = keranjangPilihan[currentCheckoutIndex];
        const imgSrc = currentItem.fotoBase64 || '../aset student/dompet.png';

        pertanyaanKasir.innerHTML = `
            <div style="display:flex; justify-content:center; margin-bottom:10px;">
                <img src="${imgSrc}" style="width:60px; height:60px; object-fit:contain; background:rgba(255,255,255,0.8); border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
            </div>
            Barang ke-${currentCheckoutIndex + 1} dari ${keranjangPilihan.length}:<br>
            <strong>${currentItem.jumlah}x ${currentItem.nama}</strong> (${formatRupiah(currentItem.harga)}/buah).<br>
            <strong>Berapa total yang harus kamu bayar untuk ini?</strong><br>
            Silakan susun uangnya di meja!
        `;
    };


    const uangButtons = document.querySelectorAll('.uang-btn');
    uangButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!keranjangPilihan || keranjangPilihan.length === 0 || currentCheckoutIndex >= keranjangPilihan.length) {
                showFeedback('Kamu belum memilih barang apapun untuk dibayar!', false);
                return;
            }

            const nominal = parseInt(e.target.getAttribute('data-nominal'));
            uangTerkumpul += nominal;
            updateCashierUI();


            const sfxKoinClone = sfxKoin.cloneNode();
            sfxKoinClone.play().catch(err => { });


            const uangClone = e.target.cloneNode(true);
            uangClone.style.position = 'fixed';
            uangClone.style.zIndex = '9999';

            const rectStart = e.target.getBoundingClientRect();
            uangClone.style.left = rectStart.left + 'px';
            uangClone.style.top = rectStart.top + 'px';

            document.body.appendChild(uangClone);

            const rectEnd = uangTerkumpulDisplay.getBoundingClientRect();
            const animasi = uangClone.animate([
                { left: rectStart.left + 'px', top: rectStart.top + 'px', transform: 'scale(1)', opacity: 1 },
                { left: rectEnd.left + 'px', top: rectEnd.top + 'px', transform: 'scale(0.5)', opacity: 0 }
            ], {
                duration: 500,
                easing: 'ease-in-out'
            });

            animasi.onfinish = () => { uangClone.remove(); };
        });
    });

    btnResetUang.addEventListener('click', () => {
        uangTerkumpul = 0;
        updateCashierUI();
    });

    btnBayar.addEventListener('click', () => {
        if (!keranjangPilihan || keranjangPilihan.length === 0 || currentCheckoutIndex >= keranjangPilihan.length) {
            showFeedback('Belum ada barang atau semua barang sudah dibayar!', false);
            return;
        }

        const currentItem = keranjangPilihan[currentCheckoutIndex];
        const currentTotal = currentItem.harga * currentItem.jumlah;


        if (uangTerkumpul !== currentTotal) {
            showFeedback(`Uang yang kamu serahkan (Rp${uangTerkumpul}) salah! Hitung lagi dengan teliti.`, false);
            uangTerkumpul = 0;
            updateCashierUI();
            return;
        }


        if (uangSaku < currentTotal) {
            showFeedback('Uang Saku Misimu tidak cukup untuk membayar ini!', false);
            uangTerkumpul = 0;
            updateCashierUI();
            return;
        }


        uangSaku -= currentTotal;
        updateWalletUI();

        showFeedback(`Hebat! Pembayaran untuk ${currentItem.nama} benar.`, true);


        for (let i = 0; i < currentItem.jumlah; i++) {

            daftarBelanjaan.push({
                foto: currentItem.fotoBase64 || '',
                nama: currentItem.nama,
                harga: currentItem.harga
            });


            const baseDelay = i * 200;
            const numParticles = 3;
            for (let p = 0; p < numParticles; p++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = 'particle';

                    let startX = 0;
                    let startY = 0;
                    const bubbleImg = document.querySelector('#pertanyaanKasir img');
                    if (bubbleImg) {
                        const imgRect = bubbleImg.getBoundingClientRect();
                        startX = imgRect.left + (imgRect.width / 2) + window.scrollX;
                        startY = imgRect.top + (imgRect.height / 2) + window.scrollY;
                    } else {
                        const kasirRect = document.querySelector('.area-kanan').getBoundingClientRect();
                        startX = kasirRect.left + 50 + window.scrollX;
                        startY = kasirRect.top + 100 + window.scrollY;
                    }

                    let endX = 0;
                    let endY = 0;
                    const basketContainer = document.querySelector('.placeholder-keranjang');
                    if (basketContainer) {
                        const rectEnd = basketContainer.getBoundingClientRect();
                        endX = rectEnd.left + (rectEnd.width / 2) + window.scrollX;
                        endY = rectEnd.top + (rectEnd.height * 0.4) + window.scrollY;
                    } else {
                        const rectEnd = keranjangVisual.getBoundingClientRect();
                        endX = rectEnd.left + (rectEnd.width / 2) + window.scrollX;
                        endY = rectEnd.top + (rectEnd.height / 2) + window.scrollY;
                    }

                    const randomStartX = startX + (Math.random() - 0.5) * 30;
                    const randomStartY = startY + (Math.random() - 0.5) * 30;
                    const randomEndX = endX + (Math.random() - 0.5) * 40;
                    const randomEndY = endY + (Math.random() - 0.5) * 20;

                    const dx = randomEndX - randomStartX;
                    const dy = randomEndY - randomStartY;
                    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                    particle.style.left = (randomStartX - 70) + 'px';
                    particle.style.top = (randomStartY - 6) + 'px';

                    const scaleFactor = 0.6 + Math.random() * 0.6;
                    particle.style.transform = `scale(${scaleFactor})`;

                    document.body.appendChild(particle);

                    const anim = particle.animate([
                        { transform: `translate(0, 0) rotate(${angle}deg) scale(${scaleFactor})`, opacity: 1 },
                        { transform: `translate(${dx}px, ${dy}px) rotate(${angle}deg) scale(${scaleFactor * 0.4})`, opacity: 0 }
                    ], {
                        duration: 550,
                        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                        fill: 'forwards'
                    });

                    anim.onfinish = () => {
                        particle.remove();
                        if (p === 0) {
                            const img = document.createElement('img');
                            img.src = currentItem.fotoBase64 || '../aset student/dompet.png';
                            img.title = currentItem.nama;
                            img.className = 'dropped';
                            keranjangVisual.appendChild(img);
                        }
                    };
                }, baseDelay + (p * 75));
            }
        }


        currentCheckoutIndex++;
        uangTerkumpul = 0;
        updateCashierUI();

        setTimeout(() => {
            if (currentCheckoutIndex >= keranjangPilihan.length) {

                setTimeout(() => {
                    akhiriGame();
                }, 1000);
            } else {

                renderPercakapanKasir();
            }
        }, currentItem.jumlah * 200 + 500);
    });


    const rotateOverlay = document.getElementById('rotateOverlay');
    const btnForceLandscape = document.getElementById('btnForceLandscape');

    function checkOrientation() {
        if (window.innerHeight > window.innerWidth) {
            rotateOverlay.style.display = 'flex';
        } else {
            rotateOverlay.style.display = 'none';
        }
    }

    window.addEventListener('resize', checkOrientation);
    checkOrientation();

    btnForceLandscape.addEventListener('click', () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().then(() => {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(console.error);
                }
            }).catch(console.error);
        }
    });


    function formatWaktu(detik) {
        const m = Math.floor(detik / 60).toString().padStart(2, '0');
        const s = (detik % 60).toString().padStart(2, '0');
        return `⏱️ ${m}:${s}`;
    }

    function mulaiTimer() {
        if (timerInterval) clearInterval(timerInterval);

        timerDisplay.textContent = formatWaktu(sisaWaktu);


        document.body.classList.add('game-started');

        timerInterval = setInterval(() => {
            if (isGameEnded) {
                clearInterval(timerInterval);
                return;
            }

            sisaWaktu--;
            timerDisplay.textContent = formatWaktu(sisaWaktu);

            if (sisaWaktu <= 10 && sisaWaktu > 0) {
                timerDisplay.classList.add('warning');
            }

            if (sisaWaktu <= 0) {
                clearInterval(timerInterval);
                akhiriGame();
            }
        }, 1000);
    }


    function akhiriGame() {
        if (isGameEnded) return;
        isGameEnded = true;


        benarCount = 0;
        salahCount = 0;
        nilai = 0;
        totalKebutuhan = 0;

        if (storySettings) {
            const kelompokSiswa = localStorage.getItem('kelompokMisiCerita') || 1;
            const storyIndex = (storySettings.alokasiCerita && typeof storySettings.alokasiCerita[kelompokSiswa] !== 'undefined') ? storySettings.alokasiCerita[kelompokSiswa] : 0;
            const currentStory = storySettings.kumpulanCerita[storyIndex] || {};
            const kunciJawaban = currentStory.kunciJawaban || [];


            const kebutuhanKunci = kunciJawaban.filter(k => k.kategori.toLowerCase() === 'kebutuhan');
            totalKebutuhan = kebutuhanKunci.length;

            const kebutuhanKunciNames = kebutuhanKunci.map(k => k.barang.toLowerCase().trim());


            const barangDibeliUnik = [...new Set(daftarBelanjaan.map(item => item.nama.toLowerCase().trim()))];

            barangDibeliUnik.forEach(nama => {

                const isMatch = kebutuhanKunciNames.some(kunci => nama.includes(kunci));
                if (isMatch) {
                    benarCount++;
                } else {
                    salahCount++;
                }
            });

            if (totalKebutuhan > 0) {
                nilai = Math.round((benarCount / totalKebutuhan) * 100);
            } else {
                nilai = 100;
            }
        }


        document.body.classList.add('evaluasi-active');
        document.body.classList.remove('game-started');


        if (window.audios && window.audios.bgm) {
            window.audios.bgm.pause();
        }


        if (timerInterval) clearInterval(timerInterval);
        timerDisplay.classList.remove('warning');


        sfxSelesai.play().catch(err => console.log('Gagal play sfx selesai:', err));


        areaGame.style.transition = 'opacity 0.5s ease';
        headerGame.style.transition = 'opacity 0.5s ease';
        areaGame.style.opacity = '0';
        headerGame.style.opacity = '0';

        setTimeout(() => {
            areaGame.style.display = 'none';
            headerGame.style.display = 'none';


            sectionEvaluasi.style.display = 'flex';
            sectionEvaluasi.style.opacity = '0';


            void sectionEvaluasi.offsetWidth;

            sectionEvaluasi.style.transition = 'opacity 0.8s ease';
            sectionEvaluasi.style.opacity = '1';
        }, 500);


        evalSaldoAwal.textContent = formatRupiah(saldoAwal);
        evalSisaSaldo.textContent = formatRupiah(uangSaku);
        teksSisaUang.textContent = formatRupiah(uangSaku);


        evalTabelBody.innerHTML = '';
        let totalBelanjaTable = 0;
        if (daftarBelanjaan.length === 0) {
            evalTabelBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:20px; color:#7F8C8D;">Kamu tidak membeli apa-apa.</td></tr>`;
        } else {
            daftarBelanjaan.forEach(item => {
                totalBelanjaTable += item.harga;
                const tr = document.createElement('tr');
                tr.className = 'evaluasi-row';
                tr.innerHTML = `
                    <td><img src="${item.foto}" class="evaluasi-item-img"></td>
                    <td class="evaluasi-item-name">${item.nama}</td>
                    <td class="evaluasi-item-price">${formatRupiah(item.harga)}</td>
                `;
                evalTabelBody.appendChild(tr);
            });


            const trTotal = document.createElement('tr');
            trTotal.innerHTML = `
                <td colspan="2" style="text-align:right; font-weight:bold; color:#2C3E50; padding:15px;">TOTAL BELANJA:</td>
                <td style="font-weight:900; color:#E74C3C; padding:15px; font-size:1.2rem;">${formatRupiah(totalBelanjaTable)}</td>
            `;
            trTotal.style.backgroundColor = '#FFF9C4';
            evalTabelBody.appendChild(trTotal);
        }


        setTimeout(() => {
            sectionEvaluasi.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 800);
    }

    btnSelesaiBelanja.addEventListener('click', () => {
        Swal.fire({
            title: 'Selesai Belanja?',
            text: 'Apakah kamu yakin ingin menyudahi belanja sekarang?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#27AE60',
            cancelButtonColor: '#E74C3C',
            confirmButtonText: 'Ya, Selesai!',
            cancelButtonText: 'Lanjut Belanja'
        }).then((result) => {
            if (result.isConfirmed) {
                akhiriGame();
            }
        });
    });

    btnSimpanEvaluasi.addEventListener('click', async () => {
        const rencana = inputPerencanaan.value.trim();
        if (!rencana) {
            Swal.fire({
                title: 'Rencana Belum Diisi!',
                text: 'Tuliskan dulu rencanamu untuk sisa uang tersebut!',
                icon: 'info',
                confirmButtonColor: '#3498DB'
            });
            return;
        }

        btnSimpanEvaluasi.disabled = true;
        btnSimpanEvaluasi.textContent = 'Menyimpan... ⏳';

        try {
            let userNama = "Siswa (Tanpa Login)";
            const auth = sessionStorage.getItem('siswaAuth');
            if (auth) {
                userNama = JSON.parse(auth).nama;
            }


            let firestorePromise = Promise.resolve();
            let docRefId = null;
            if (typeof db !== 'undefined') {
                firestorePromise = db.collection('perencanaan').add({
                    namaSiswa: userNama,
                    saldoAwal: saldoAwal,
                    sisaSaldo: uangSaku,
                    daftarBelanjaan: daftarBelanjaan,
                    rencanaSisaUang: rencana,
                    nilaiKuis: nilai,
                    tanggal: firebase.firestore.FieldValue.serverTimestamp()
                }).then(docRef => {
                    docRefId = docRef.id;
                }).catch(e => console.error(e));
            }


            let resultPromise = Promise.resolve();
            if (auth && typeof saveStudentResult === 'function') {
                const parsedAuth = JSON.parse(auth);
                const status = uangSaku >= 0 ? "Aman (Tersisa)" : "Minus (Hutang)";


                const totalBelanja = daftarBelanjaan.reduce((sum, item) => sum + item.harga, 0);
                const jumlahBarang = daftarBelanjaan.length;


                const groupedItems = {};
                daftarBelanjaan.forEach(item => {
                    if (!groupedItems[item.nama]) {
                        groupedItems[item.nama] = { ...item, qty: 1, subtotal: item.harga };
                    } else {
                        groupedItems[item.nama].qty += 1;
                        groupedItems[item.nama].subtotal += item.harga;
                    }
                });

                let rincianBarangHTML = '<div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:10px; margin-bottom:15px;">';
                if (jumlahBarang === 0) {
                    rincianBarangHTML += '<span style="font-size:1.1rem; color:#7F8C8D;"><i>Tidak membeli apa-apa</i></span>';
                } else {
                    Object.values(groupedItems).forEach(item => {
                        let qtyBadge = item.qty > 1 ? `<div style="position:absolute; top:10px; right:10px; background:#F1C40F; color:#000; font-weight:bold; font-size:1.1rem; padding:5px 12px; border-radius:15px; border:2px solid #D4AC0D; box-shadow:0 2px 5px rgba(0,0,0,0.4); z-index:2;">x${item.qty}</div>` : '';
                        rincianBarangHTML += `
                            <div style="background:#fff; border:2px solid #ecf0f1; border-radius:15px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 5px 15px rgba(0,0,0,0.1); position:relative; width:220px;">
                                ${qtyBadge}
                                <img src="${item.foto}" style="width:100%; height:150px; object-fit:cover; z-index:1; border-bottom:2px solid #f1f2f6;">
                                <div style="padding:15px; line-height:1.4; text-align:left;">
                                    <div style="font-size:1.3rem; font-weight:900; color:#2C3E50; margin-bottom:8px;">${item.nama}</div>
                                    <div style="font-size:1.2rem; color:#E74C3C; font-weight:800;">Rp ${item.subtotal.toLocaleString('id-ID')}</div>
                                </div>
                            </div>
                        `;
                    });
                }
                rincianBarangHTML += '</div>';


                const catatanFormatted = `
                    <div style="font-size:1.2rem; line-height:1.5;">
                        <div style="background:#eef7f2; padding:12px 15px; border-radius:8px; margin-bottom:12px; border-left:5px solid #27AE60; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                            <strong style="color:#1e8449; font-size:1.2rem;">📊 Hasil Evaluasi Belanja:</strong><br>
                            <strong>Nilai Belanja Kebutuhan:</strong> <span style="font-weight:900; color:#27AE60; font-size:1.30rem;">${nilai} / 100</span> (Benar Kebutuhan: ${benarCount} dari ${totalKebutuhan})<br>
                            <strong>Barang Salah (Keinginan/Lainnya):</strong> ${salahCount}
                        </div>
                        <strong style="font-size:1.3rem; color:#34495E;">🛒 Total Belanja (${jumlahBarang} Barang):</strong> <span style="font-weight:900; color:#2C3E50;">Rp ${totalBelanja.toLocaleString('id-ID')}</span>
                        ${rincianBarangHTML}
                        <hr style="margin:12px 0; border:0; border-top:2px dashed #bdc3c7;">
                        <strong>Modal Awal:</strong> Rp ${saldoAwal.toLocaleString('id-ID')}<br>
                        <strong>Sisa Saldo Akhir:</strong> <span style="color:${uangSaku >= 0 ? '#27AE60' : '#E74C3C'}; font-weight:900; font-size:1.3rem;">Rp ${uangSaku.toLocaleString('id-ID')}</span><br>
                        <strong>Status:</strong> <span style="font-weight:bold; background:${uangSaku >= 0 ? '#d5f5e3' : '#fadbd8'}; padding:2px 8px; border-radius:6px; color:${uangSaku >= 0 ? '#1e8449' : '#c0392b'};">${status}</span><br>
                        <div style="background:#e8f4f8; padding:12px 15px; border-radius:8px; margin-top:12px; border-left:5px solid #3498DB; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                            <strong style="color:#2980B9; font-size:1.15rem;">💡 Rencana Penggunaan Sisa Uang:</strong><br>
                            <i style="color:#34495E; font-size:1.1rem;">"${rencana}"</i>
                        </div>
                    </div>
                `;

                resultPromise = saveStudentResult({
                    nama: parsedAuth.nama,
                    kelas: parsedAuth.kelas,
                    aktivitas: "Mini-Game Belanja",
                    skorAkhir: `Rp ${uangSaku}`,
                    catatan: catatanFormatted
                }).catch(e => console.error(e));
            }


            await Promise.race([
                Promise.all([firestorePromise, resultPromise]),
                new Promise(resolve => setTimeout(resolve, 2000))
            ]);


            Swal.fire({
                title: 'Tunggu Izin Guru',
                html: 'Laporan belanjamu sedang diperiksa.<br>Tunggu disetujui Guru untuk lanjut ya!<br><br><span id="statusIzinTextSwal" style="color:#E67E22; font-weight:bold; font-size:1.1rem;">⏳ Menunggu Izin Guru...</span>',
                icon: 'info',
                showConfirmButton: true,
                confirmButtonText: 'Menunggu Izin...',
                confirmButtonColor: '#95A5A6',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                didOpen: () => {
                    const confirmBtn = Swal.getConfirmButton();
                    confirmBtn.disabled = true;
                    confirmBtn.style.opacity = '0.5';
                    confirmBtn.style.cursor = 'not-allowed';

                    if (typeof db !== 'undefined' && docRefId) {

                        db.collection('perencanaan').doc(docRefId).onSnapshot((doc) => {
                            if (doc.exists) {
                                const data = doc.data();
                                if (data.izinLanjut === true) {
                                    const statusText = document.getElementById('statusIzinTextSwal');
                                    if (statusText) {
                                        statusText.innerHTML = '✅ Guru Mengizinkan!';
                                        statusText.style.color = '#27AE60';
                                    }


                                    const iconElement = Swal.getIcon();
                                    if (iconElement) {
                                        iconElement.className = 'swal2-icon swal2-success swal2-icon-show';
                                        iconElement.innerHTML = '<div class="swal2-success-circular-line-left" style="background-color: rgb(255, 255, 255);"></div><span class="swal2-success-line-tip"></span><span class="swal2-success-line-long"></span><div class="swal2-success-ring"></div><div class="swal2-success-fix" style="background-color: rgb(255, 255, 255);"></div><div class="swal2-success-circular-line-right" style="background-color: rgb(255, 255, 255);"></div>';
                                    }


                                    const titleEl = Swal.getTitle();
                                    if (titleEl) {
                                        titleEl.textContent = 'Disetujui Guru!';
                                    }

                                    confirmBtn.disabled = false;
                                    confirmBtn.style.opacity = '1';
                                    confirmBtn.style.cursor = 'pointer';
                                    confirmBtn.textContent = 'Lanjut Evaluasi 🚀';
                                    confirmBtn.style.backgroundColor = '#27AE60';


                                    if (window.audios && window.audios.click) {
                                        window.audios.click.play().catch(e => console.log(e));
                                    }
                                }
                            }
                        });
                    } else {

                        confirmBtn.disabled = false;
                        confirmBtn.style.opacity = '1';
                        confirmBtn.style.cursor = 'pointer';
                        confirmBtn.textContent = 'Lanjut Evaluasi 🚀';
                        confirmBtn.style.backgroundColor = '#27AE60';

                        const statusText = document.getElementById('statusIzinTextSwal');
                        if (statusText) {
                            statusText.innerHTML = '✅ Sesi Offline (Bisa Lanjut)';
                            statusText.style.color = '#27AE60';
                        }
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    if (docRefId) {
                        window.location.href = `evaluasi-ai.html?docId=${docRefId}`;
                    } else {
                        window.location.href = 'index.html';
                    }
                }
            });

        } catch (error) {
            console.error('Gagal menyimpan evaluasi:', error);
            Swal.fire({
                title: 'Gagal Menyimpan',
                text: 'Gagal menyimpan data. Pastikan koneksi internetmu aktif!',
                icon: 'error',
                confirmButtonColor: '#E74C3C'
            });
            btnSimpanEvaluasi.disabled = false;
            btnSimpanEvaluasi.textContent = '💾 Simpan ke Buku Tabungan';
        }
    });

    if (btnTutupEvaluasi) {
        btnTutupEvaluasi.addEventListener('click', () => {
            Swal.fire({
                title: 'Keluar Laporan?',
                text: 'Yakin ingin keluar dari laporan? Rencana sisa uangmu mungkin belum tersimpan.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#E74C3C',
                cancelButtonColor: '#95A5A6',
                confirmButtonText: 'Ya, Keluar',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'index.html';
                }
            });
        });
    }


    initData();
});