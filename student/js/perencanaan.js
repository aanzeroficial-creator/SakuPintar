

document.addEventListener('DOMContentLoaded', () => {
    
    
    
    let uangJajan = 0;
    const savedUangSaku = localStorage.getItem('uangSakuCerita') || localStorage.getItem('uangSakuMisi');
    if (savedUangSaku) {
        uangJajan = parseInt(savedUangSaku);
    }
    let daftarPengeluaran = [];

    
    const inputUangJajan = document.getElementById('inputUangJajan');
    const formPengeluaran = document.getElementById('formPengeluaran');
    const namaPengeluaran = document.getElementById('namaPengeluaran');
    const hargaPengeluaran = document.getElementById('hargaPengeluaran');
    const kategoriPengeluaran = document.getElementById('kategoriPengeluaran');
    const alasanPengeluaran = document.getElementById('alasanPengeluaran'); 

    
    const displayUangJajan = document.getElementById('displayUangJajan');
    const displayTotalPengeluaran = document.getElementById('displayTotalPengeluaran');
    const displaySisaUang = document.getElementById('displaySisaUang');
    const expenseList = document.getElementById('expenseList');
    const pesanMotivasi = document.getElementById('pesanMotivasi');
    const rencanaSisaUang = document.getElementById('rencanaSisaUang'); 

    

    
    
    inputUangJajan.addEventListener('input', (e) => {
        const val = parseInt(e.target.value); 
        
        uangJajan = isNaN(val) ? 0 : val;
        
        updateUI(); 
    });

    
    formPengeluaran.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const nama = namaPengeluaran.value;
        const harga = parseInt(hargaPengeluaran.value);
        const kategori = kategoriPengeluaran.value;
        const alasan = alasanPengeluaran.value;

        
        if (nama && !isNaN(harga) && harga > 0 && kategori && alasan) {
            
            const sfxAdd = new Audio('../klik semua.mp3');
            sfxAdd.play().catch(err => {});

            
            daftarPengeluaran.push({
                id: Date.now(), 
                nama: nama,
                harga: harga,
                kategori: kategori,
                alasan: alasan
            });

            
            namaPengeluaran.value = '';
            hargaPengeluaran.value = '';
            kategoriPengeluaran.value = '';
            alasanPengeluaran.value = '';
            
            
            updateUI();
        }
    });

    
       
    
    function updateUI() {
        
        let totalPengeluaran = 0;
        daftarPengeluaran.forEach(item => {
            totalPengeluaran += item.harga; 
        });

        
        let sisaUang = uangJajan - totalPengeluaran;

        
        displayUangJajan.textContent = formatRupiah(uangJajan);
        displayTotalPengeluaran.textContent = formatRupiah(totalPengeluaran);
        displaySisaUang.textContent = formatRupiah(sisaUang);
        
        
        if (floatingSisaUangVal) {
            floatingSisaUangVal.textContent = formatRupiah(sisaUang);
            if (sisaUang < 0) {
                floatingSisaUangVal.style.color = "var(--danger)";
            } else if (sisaUang === 0) {
                floatingSisaUangVal.style.color = "#D35400";
            } else {
                floatingSisaUangVal.style.color = "var(--success)";
            }
        }

        
        const kotakSisaUang = displaySisaUang.parentElement;

        if (sisaUang < 0) {
            
            displaySisaUang.style.color = "var(--danger)"; 
            kotakSisaUang.style.backgroundColor = "#FDEDEC"; 
            kotakSisaUang.style.borderColor = "#F1948A";
            pesanMotivasi.textContent = "Wah, uangmu kurang! Coba kurangi rencanamu ya.";
            pesanMotivasi.style.color = "var(--danger)";
        } else if (sisaUang === 0 && uangJajan > 0) {
            
            displaySisaUang.style.color = "#D35400"; 
            kotakSisaUang.style.backgroundColor = "#FEF5E7";
            kotakSisaUang.style.borderColor = "#F8C471";
            pesanMotivasi.textContent = "Uangmu pas. Sayang sekali hari ini belum ada sisa.";
            pesanMotivasi.style.color = "#D35400";
        } else if (sisaUang > 0 && totalPengeluaran > 0) {
            
            displaySisaUang.style.color = "var(--success)"; 
            kotakSisaUang.style.backgroundColor = "#E8F8F5";
            kotakSisaUang.style.borderColor = "#A2D9CE";
            pesanMotivasi.textContent = "Hebat, hari ini uangmu masih tersisa 👍";
            pesanMotivasi.style.color = "var(--success)";
        } else if (uangJajan > 0 && totalPengeluaran === 0) {
             
             displaySisaUang.style.color = "var(--primary-color)";
             kotakSisaUang.style.backgroundColor = "#E8F8F5";
             kotakSisaUang.style.borderColor = "#A2D9CE";
             pesanMotivasi.textContent = "Wah banyak sisa uangnya! Yuk buat rencana pengeluaranmu.";
             pesanMotivasi.style.color = "var(--text-dark)";
        } else {
            
            displaySisaUang.style.color = "var(--primary-color)";
            kotakSisaUang.style.backgroundColor = "#f1f2f6";
            kotakSisaUang.style.borderColor = "#dfe4ea";
            pesanMotivasi.textContent = "Ayo mulai catat rencanamu!";
            pesanMotivasi.style.color = "var(--text-dark)";
        }

        
        renderExpenseList();
    }

    

    
    function renderExpenseList() {
        expenseList.innerHTML = ''; 

        
        if (daftarPengeluaran.length === 0) {
            expenseList.innerHTML = '<li style="text-align: center; color: #7f8c8d; padding: 10px;">Belum ada rencana jajan.</li>';
            return; 
        }

        
        daftarPengeluaran.forEach(item => {
            const li = document.createElement('li'); 
            li.className = 'expense-item';
            
            const badgeClass = item.kategori === 'kebutuhan' ? 'background: #2ECC71;' : 'background: #F39C12;';
            const kategoriText = item.kategori === 'kebutuhan' ? 'Kebutuhan' : 'Keinginan';
            
            
            li.innerHTML = `
                <div style="flex-grow: 1;">
                    <strong>${item.nama}</strong><br>
                    <span style="${badgeClass} color: white; padding: 3px 8px; border-radius: 10px; font-size: 0.75rem; margin-right: 10px;">${kategoriText}</span>
                    <span style="color: var(--danger); font-size: 0.95rem; font-weight: bold;">${formatRupiah(item.harga)}</span>
                    <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #555;"><i>Alasan: ${item.alasan}</i></p>
                </div>
                <!-- Simpan ID unik item di dalam atribut data-id agar mudah ditemukan saat mau dihapus -->
                <button class="btn-delete" data-id="${item.id}">Hapus</button>
            `;

            
            expenseList.appendChild(li);
        });

        
        
        
        
        
        const deleteButtons = document.querySelectorAll('.btn-delete');
        
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                
                const idToDelete = parseInt(e.target.getAttribute('data-id'));
                
                
                
                daftarPengeluaran = daftarPengeluaran.filter(item => item.id !== idToDelete);
                
                
                updateUI();
            });
        });
    }

    
    
    
    const btnKirimLaporan = document.getElementById('btnKirimLaporan');
    if (btnKirimLaporan) {
        btnKirimLaporan.addEventListener('click', async () => {
            if (uangJajan <= 0) {
                alert("Isi dulu uang saku kamu!");
                return;
            }
            if (rencanaSisaUang && rencanaSisaUang.value.trim() === '') {
                alert("Silakan tulis dulu rencana untuk sisa uangmu!");
                return;
            }

            const authData = sessionStorage.getItem('siswaAuth');
            let siswa = {nama: "Siswa Dummy", kelas: "Debug"};
            if (authData) {
                siswa = JSON.parse(authData);
            }
            
            let totalPengeluaran = 0;
                daftarPengeluaran.forEach(item => totalPengeluaran += item.harga);
                
                const sisa = uangJajan - totalPengeluaran;
                const status = (sisa >= 0) ? "Aman/Ada Sisa" : "Minus (Kekurangan Uang)";
                
                let rincianBarang = "<ul style='margin:5px 0; padding-left:20px; font-size:0.9rem;'>";
                daftarPengeluaran.forEach(item => {
                    const labelKat = item.kategori === 'kebutuhan' ? 'Kebutuhan' : 'Keinginan';
                    rincianBarang += `<li>${item.nama} <i>(${labelKat})</i> : <b>${formatRupiah(item.harga)}</b><br><small>Alasan: ${item.alasan}</small></li>`;
                });
                rincianBarang += "</ul>";
                
                const catatanTambahan = `<br><strong>Rencana Sisa Uang:</strong> ${rencanaSisaUang ? rencanaSisaUang.value : '-'}`;
                
                const oldText = btnKirimLaporan.textContent;
                btnKirimLaporan.textContent = "Mengirim...";
                btnKirimLaporan.disabled = true;

                try {
                    if (typeof saveStudentResult === "function") {
                        await saveStudentResult({
                            nama: siswa.nama,
                            kelas: siswa.kelas,
                            aktivitas: "Perencanaan Keuangan",
                            skorAkhir: formatRupiah(totalPengeluaran), 
                            catatan: `<strong>Uang Saku:</strong> ${formatRupiah(uangJajan)} <br> <strong>Status:</strong> ${status} <br> <strong>Rincian Jajan:</strong>${rincianBarang} ${catatanTambahan}`,
                            
                            uangJajan: uangJajan,
                            totalPengeluaran: totalPengeluaran,
                            sisaUang: sisa,
                            status: status,
                            daftarPengeluaran: daftarPengeluaran,
                            rencanaSisaUang: rencanaSisaUang ? rencanaSisaUang.value : '-'
                        });
                    } else {
                        console.warn("Fungsi saveStudentResult tidak ditemukan.");
                    }

                    const sfxSave = new Audio('../benar.mp3');
                    sfxSave.play().catch(e=>{});

                    alert("Laporan berhasil dikirim ke Dasbor Guru dan tersimpan di Cloud!");
                    
                    
                    window.open('riwayat-perencanaan.html', '_blank');
                    
                } catch(e) {
                    console.error("Gagal kirim", e);
                    alert("Gagal mengirim laporan. Coba lagi.");
                } finally {
                    btnKirimLaporan.textContent = oldText;
                    btnKirimLaporan.disabled = false;
                }
        });
    }

    
    if (inputUangJajan && uangJajan > 0) {
        inputUangJajan.value = uangJajan;
    }
    updateUI();
});


    
    
    
    const floatingWidget = document.getElementById('floatingWidget');
    const floatingSisaUangVal = document.getElementById('floatingSisaUangVal');

    if (floatingWidget) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        const dragHandle = floatingWidget.querySelector('.drag-handle');

        
        const dragStart = (e) => {
            isDragging = true;
            const event = e.type.includes('touch') ? e.touches[0] : e;
            startX = event.clientX;
            startY = event.clientY;
            
            const rect = floatingWidget.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            
            floatingWidget.style.bottom = 'auto';
            floatingWidget.style.right = 'auto';
            floatingWidget.style.left = initialX + 'px';
            floatingWidget.style.top = initialY + 'px';
            floatingWidget.style.transform = 'scale(1.05)';
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault(); 
            const event = e.type.includes('touch') ? e.touches[0] : e;
            
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            
            let newX = initialX + dx;
            let newY = initialY + dy;
            
            
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + floatingWidget.offsetWidth > window.innerWidth) newX = window.innerWidth - floatingWidget.offsetWidth;
            if (newY + floatingWidget.offsetHeight > window.innerHeight) newY = window.innerHeight - floatingWidget.offsetHeight;

            floatingWidget.style.left = newX + 'px';
            floatingWidget.style.top = newY + 'px';
        };

        const dragEnd = () => {
            isDragging = false;
            floatingWidget.style.transform = 'scale(1)';
        };

        dragHandle.addEventListener('mousedown', dragStart);
        dragHandle.addEventListener('touchstart', dragStart, {passive: false});

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, {passive: false});

        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }
