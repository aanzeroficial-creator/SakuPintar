


document.addEventListener('DOMContentLoaded', () => {
    
    
    
    if (!sessionStorage.getItem('guruAuth')) {
        window.location.href = '../login-guru.html';
        return; 
    }

    
    
    
    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('guruAuth');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 300);
    };

    const btnLogoutGuru = document.querySelector('.btn-logout-new');
    if (btnLogoutGuru) {
        btnLogoutGuru.addEventListener('click', handleLogout);
    }

    
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('.dashboard-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            
            navItems.forEach(nav => nav.classList.remove('active'));
            
            item.classList.add('active');
            
            
            sections.forEach(sec => sec.style.display = 'none');
            
            
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });

    
    const limitInput = document.getElementById('limitFoto');
    const btnSaveLimit = document.getElementById('btnSaveLimit');
    const saveMessage = document.getElementById('saveMessage');

    
    function compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_WIDTH = 600; 
                    const MAX_HEIGHT = 600;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = Math.round(height *= MAX_WIDTH / width);
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = Math.round(width *= MAX_HEIGHT / height);
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.6)); 
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    
    async function loadSettings() {
        if(limitInput && typeof getSettings === 'function') {
            const settings = await getSettings();
            limitInput.value = settings.limitFoto;
        }

        
        try {
            const allItems = typeof getAllItems === 'function' ? await getAllItems() : [];
            window.cachedItemsList = allItems.filter(item => item.uploader === 'guru');
        } catch (e) {
            console.error("Gagal memuat barang untuk auto-complete:", e);
            window.cachedItemsList = [];
        }
        
        
        const kelompokInput = document.getElementById('jumlahKelompok');
        if (kelompokInput) {
            kelompokInput.addEventListener('change', (e) => {
                const count = parseInt(e.target.value) || 1;
                
                const currentStories = collectCeritaInputs();
                renderCeritaInputs(count, currentStories);
            });
        }
    }
    loadSettings();

    
    if (typeof listenToStorySettings === 'function') {
        listenToStorySettings((storySet) => {
            
            const statusText = document.getElementById('undianStatusText');
            const statusList = document.getElementById('undianList');
            if (statusText && statusList) {
                const alokasi = storySet.alokasiCerita || {};
                const totalKelompok = storySet.jumlahKelompok || 1;
                const pickedCount = Object.keys(alokasi).length;

                statusText.textContent = `${pickedCount} dari ${totalKelompok} Kelompok telah mengundi.`;
                
                if (pickedCount === 0) {
                    statusList.innerHTML = '<li style="color: #7F8C8D;">Belum ada kelompok yang mengundi.</li>';
                } else {
                    statusList.innerHTML = '';
                    for (const [kelompokId, storyIndex] of Object.entries(alokasi)) {
                        const li = document.createElement('li');
                        li.style.marginBottom = "5px";
                        li.style.padding = "5px";
                        li.style.borderBottom = "1px dashed #bdc3c7";
                        li.innerHTML = `<span style="display:inline-block; width:100px; font-weight:bold; color:#E67E22;">Kelompok ${kelompokId}</span> ➡️ <span style="font-weight:bold; color:#2C3E50;">Mendapat Cerita ${parseInt(storyIndex)+1}</span>`;
                        statusList.appendChild(li);
                    }
                }
            }

            
            const aturanInput = document.getElementById('aturanMain');
            const kelompokInput = document.getElementById('jumlahKelompok');

            if (aturanInput && document.activeElement !== aturanInput) {
                aturanInput.value = storySet.aturan || '';
            }

            if (kelompokInput && document.activeElement !== kelompokInput) {
                const targetCount = storySet.jumlahKelompok || 1;
                kelompokInput.value = targetCount;
                renderCeritaInputs(targetCount, storySet.kumpulanCerita || []);
            } else if (!kelompokInput) {
                
                renderCeritaInputs(storySet.jumlahKelompok || 1, storySet.kumpulanCerita || []);
            }
        });
    }

    function createKunciRow(keyData = { barang: '', kategori: 'Kebutuhan', alasan: '' }) {
        const tr = document.createElement('tr');
        tr.className = 'kunci-row';
        tr.innerHTML = `
            <td style="padding:6px; border:1px solid #ddd;">
                <input type="text" class="kunci-barang-input" list="itemsDatalist" value="${keyData.barang}" placeholder="Ketik/Pilih barang..." required style="padding:8px; width:100%; box-sizing:border-box; border-radius:5px; border:1px solid #ccc;">
            </td>
            <td style="padding:6px; border:1px solid #ddd;">
                <select class="kunci-kategori-input" style="padding:8px; width:100%; box-sizing:border-box; border-radius:5px; border:1px solid #ccc; font-weight:bold;">
                    <option value="Kebutuhan" ${keyData.kategori === 'Kebutuhan' ? 'selected' : ''}>Kebutuhan</option>
                    <option value="Keinginan" ${keyData.kategori === 'Keinginan' ? 'selected' : ''}>Keinginan</option>
                </select>
            </td>
            <td style="padding:6px; border:1px solid #ddd;">
                <input type="text" class="kunci-alasan-input" value="${keyData.alasan}" placeholder="Alasan logis..." required style="padding:8px; width:100%; box-sizing:border-box; border-radius:5px; border:1px solid #ccc;">
            </td>
            <td style="padding:6px; border:1px solid #ddd; text-align:center;">
                <button type="button" class="btn-delete-kunci" style="background:#E74C3C; color:white; border:none; padding:6px 12px; border-radius:5px; cursor:pointer; font-weight:bold;">Hapus</button>
            </td>
        `;
        
        tr.querySelector('.btn-delete-kunci').addEventListener('click', () => {
            tr.remove();
        });
        
        return tr;
    }

    function createCeritaBox(i, storyData) {
        const val = typeof storyData === 'string' ? storyData : (storyData.teks || '');
        const uangSaku = typeof storyData === 'object' && storyData.uangSaku ? storyData.uangSaku : 20000;
        const gender = typeof storyData === 'object' && storyData.gender ? storyData.gender : 'L';
        const fotos = (typeof storyData === 'object' && storyData.fotos) ? storyData.fotos : [];
        const fotosJson = JSON.stringify(fotos);

        
        let previewHtml = '';
        fotos.forEach((b64, idx) => {
            previewHtml += `<div class="preview-item" data-idx="${idx}" style="position:relative; display:inline-block; margin-right:10px; margin-bottom:10px;">
                               <img src="${b64}" style="height:60px; border-radius:5px; border:1px solid #ccc;">
                               <button type="button" class="btn-remove-foto" style="position:absolute; top:-5px; right:-5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; font-size:10px; cursor:pointer;">X</button>
                            </div>`;
        });

        const box = document.createElement('div');
        box.className = 'cerita-box';
        box.style.display = 'flex';
        box.style.flexDirection = 'column';
        box.style.gap = '8px';
        box.style.border = '1px dashed #ccc';
        box.style.padding = '15px';
        box.style.borderRadius = '10px';
        box.style.marginBottom = '20px';
        box.style.background = '#fcfcfc';

        box.innerHTML = `
            <label class="cerita-label" style="font-weight:bold; color:#2980B9; font-size:1.1rem;">Cerita untuk Kelompok ${i + 1}</label>
            
            <label style="font-weight:bold; color:#16A085; margin-top:5px;">Gender Karakter Pembeli:</label>
            <select class="gender-input" style="padding:8px; border-radius:5px; border:1px solid #ccc; width:150px;">
                <option value="L" ${gender === 'L' ? 'selected' : ''}>Laki-laki (Cowok)</option>
                <option value="P" ${gender === 'P' ? 'selected' : ''}>Perempuan (Cewek)</option>
            </select>
            
            <!-- Fitur Foto Cerita -->
            <label style="font-weight:bold; color:#8E44AD; margin-top:5px;">Tambahkan Foto Cerita (Opsional):</label>
            <input type="file" multiple accept="image/*" class="foto-upload-input" style="font-size:0.9rem;">
            <div class="foto-preview-area" style="margin-top:5px;">${previewHtml}</div>
            <textarea class="foto-data-input" style="display:none;">${fotosJson}</textarea>
            
            <label style="font-weight:bold; color:#2C3E50; margin-top:5px;">Teks Kasus:</label>
            <textarea class="cerita-input" rows="3" style="padding:8px; border-radius:5px; border:1px solid #ccc; font-family:inherit; resize:vertical;" placeholder="Masukkan variasi cerita kasus...">${val}</textarea>
            
            <label style="font-weight:bold; color:#E67E22; margin-top:5px;">Modal Uang Saku (Rp):</label>
            <input type="number" class="uang-saku-input" min="1000" step="1000" value="${uangSaku}" style="padding:8px; border-radius:5px; border:1px solid #ccc; width:150px;">

            <!-- Tabel Kunci Jawaban Paten -->
            <label style="font-weight:bold; color:#E74C3C; margin-top:15px; display:flex; align-items:center; gap:5px;">🔑 Kunci Jawaban Paten (Tabel):</label>
            <div style="overflow-x:auto; margin-top:5px; margin-bottom:5px;">
                <table style="width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden; border:1px solid #ddd;">
                    <thead>
                        <tr style="background:#f2f2f2; color:#2C3E50; border-bottom:2px solid #ddd;">
                            <th style="padding:8px; border:1px solid #ddd; text-align:left;">Nama Barang</th>
                            <th style="padding:8px; border:1px solid #ddd; text-align:left; width:150px;">Kategori</th>
                            <th style="padding:8px; border:1px solid #ddd; text-align:left;">Alasan Logis</th>
                            <th style="padding:8px; border:1px solid #ddd; text-align:center; width:80px;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="kunci-jawaban-body"></tbody>
                </table>
            </div>
            <button type="button" class="btn-tambah-kunci" style="align-self:flex-start; margin-top:5px; background:#1ABC9C; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; font-weight:bold; font-size:0.85rem;">+ Tambah Barang</button>
        `;

        const fileInput = box.querySelector('.foto-upload-input');
        const dataInput = box.querySelector('.foto-data-input');
        const previewArea = box.querySelector('.foto-preview-area');
        const tbody = box.querySelector('.kunci-jawaban-body');

        
        const keys = storyData.kunciJawaban || [];
        keys.forEach(k => {
            tbody.appendChild(createKunciRow(k));
        });

        
        box.querySelector('.btn-tambah-kunci').addEventListener('click', () => {
            tbody.appendChild(createKunciRow());
        });

        
        previewArea.addEventListener('click', (e) => {
            if(e.target.classList.contains('btn-remove-foto')) {
                const item = e.target.closest('.preview-item');
                const idx = item.getAttribute('data-idx');
                let currentFotos = JSON.parse(dataInput.value || '[]');
                currentFotos.splice(idx, 1);
                dataInput.value = JSON.stringify(currentFotos);
                item.remove();
                const remainingItems = previewArea.querySelectorAll('.preview-item');
                remainingItems.forEach((ri, newIdx) => ri.setAttribute('data-idx', newIdx));
            }
        });

        
        fileInput.addEventListener('change', async (e) => {
            const files = e.target.files;
            if(!files || files.length === 0) return;
            
            let currentFotos = JSON.parse(dataInput.value || '[]');
            let newlyAddedCount = 0;

            for(let file of files) {
                try {
                    const compressedBase64 = await compressImage(file);
                    currentFotos.push(compressedBase64);
                    newlyAddedCount++;
                } catch (err) {
                    console.error("Gagal memproses gambar:", err);
                }
            }

            dataInput.value = JSON.stringify(currentFotos);

            let newHtml = '';
            currentFotos.forEach((b64, idx) => {
                newHtml += `<div class="preview-item" data-idx="${idx}" style="position:relative; display:inline-block; margin-right:10px; margin-bottom:10px;">
                               <img src="${b64}" style="height:60px; border-radius:5px; border:1px solid #ccc;">
                               <button type="button" class="btn-remove-foto" style="position:absolute; top:-5px; right:-5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; font-size:10px; cursor:pointer;">X</button>
                            </div>`;
            });
            previewArea.innerHTML = newHtml;

            if (newlyAddedCount > 0) {
                alert(`${newlyAddedCount} foto berhasil ditambahkan!`);
            }
            fileInput.value = "";
        });

        return box;
    }

    function renderCeritaInputs(count, existingStories) {
        const container = document.getElementById('ceritaContainer');
        if (!container) return;
        
        
        let datalist = document.getElementById('itemsDatalist');
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = 'itemsDatalist';
            container.appendChild(datalist);
        }
        
        
        if (window.cachedItemsList && window.cachedItemsList.length > 0) {
            let optionsHtml = '';
            window.cachedItemsList.forEach(item => {
                optionsHtml += `<option value="${item.nama}">`;
            });
            datalist.innerHTML = optionsHtml;
        }

        const existingBoxes = container.querySelectorAll('.cerita-box');

        
        if (existingBoxes.length > count) {
            for (let i = existingBoxes.length - 1; i >= count; i--) {
                existingBoxes[i].remove();
            }
        }

        
        if (existingBoxes.length < count) {
            for (let i = existingBoxes.length; i < count; i++) {
                const storyData = existingStories[i] || {};
                const newBox = createCeritaBox(i, storyData);
                container.appendChild(newBox);
            }
        }

        
        const currentBoxes = container.querySelectorAll('.cerita-box');
        for (let i = 0; i < Math.min(existingBoxes.length, count); i++) {
            const box = currentBoxes[i];
            const storyData = existingStories[i] || {};
            const val = typeof storyData === 'string' ? storyData : (storyData.teks || '');
            const uangSaku = typeof storyData === 'object' && storyData.uangSaku ? storyData.uangSaku : 20000;
            const gender = typeof storyData === 'object' && storyData.gender ? storyData.gender : 'L';
            const fotos = (typeof storyData === 'object' && storyData.fotos) ? storyData.fotos : [];
            const keys = storyData.kunciJawaban || [];

            
            const label = box.querySelector('.cerita-label');
            if (label) label.textContent = `Cerita untuk Kelompok ${i + 1}`;

            
            const genderSelect = box.querySelector('.gender-input');
            if (genderSelect && document.activeElement !== genderSelect) {
                genderSelect.value = gender;
            }

            
            const ceritaTextarea = box.querySelector('.cerita-input');
            if (ceritaTextarea && document.activeElement !== ceritaTextarea) {
                ceritaTextarea.value = val;
            }

            
            const uangSakuInput = box.querySelector('.uang-saku-input');
            if (uangSakuInput && document.activeElement !== uangSakuInput) {
                uangSakuInput.value = uangSaku;
            }

            
            const fileInput = box.querySelector('.foto-upload-input');
            const dataInput = box.querySelector('.foto-data-input');
            const previewArea = box.querySelector('.foto-preview-area');
            if (fileInput && document.activeElement !== fileInput && dataInput && previewArea) {
                const existingFotosJson = dataInput.value || '[]';
                const incomingFotosJson = JSON.stringify(fotos);
                if (existingFotosJson !== incomingFotosJson) {
                    dataInput.value = incomingFotosJson;
                    let previewHtml = '';
                    fotos.forEach((b64, idx) => {
                        previewHtml += `<div class="preview-item" data-idx="${idx}" style="position:relative; display:inline-block; margin-right:10px; margin-bottom:10px;">
                                           <img src="${b64}" style="height:60px; border-radius:5px; border:1px solid #ccc;">
                                           <button type="button" class="btn-remove-foto" style="position:absolute; top:-5px; right:-5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; font-size:10px; cursor:pointer;">X</button>
                                        </div>`;
                    });
                    previewArea.innerHTML = previewHtml;
                }
            }

            
            const tbody = box.querySelector('.kunci-jawaban-body');
            const hasFocusInTable = tbody ? tbody.contains(document.activeElement) : false;
            if (tbody && !hasFocusInTable) {
                const currentKeys = [];
                const rows = tbody.querySelectorAll('.kunci-row');
                rows.forEach(row => {
                    const barang = row.querySelector('.kunci-barang-input').value.trim();
                    const kategori = row.querySelector('.kunci-kategori-input').value;
                    const alasan = row.querySelector('.kunci-alasan-input').value.trim();
                    if (barang) {
                        currentKeys.push({ barang, kategori, alasan });
                    }
                });

                if (JSON.stringify(currentKeys) !== JSON.stringify(keys)) {
                    tbody.innerHTML = '';
                    keys.forEach(k => {
                        tbody.appendChild(createKunciRow(k));
                    });
                }
            }
        }
    }

    function collectCeritaInputs() {
        const inputs = document.querySelectorAll('.cerita-input');
        const uangSakuInputs = document.querySelectorAll('.uang-saku-input');
        const genderInputs = document.querySelectorAll('.gender-input');
        const fotoDataInputs = document.querySelectorAll('.foto-data-input');
        const storyBoxes = document.querySelectorAll('.cerita-box');
        const result = [];
        
        for (let i = 0; i < inputs.length; i++) {
            let fotos = [];
            try { fotos = JSON.parse(fotoDataInputs[i].value); } catch(e){}
            
            
            const box = storyBoxes[i];
            const kunciRows = box.querySelectorAll('.kunci-row');
            const kunciJawaban = [];
            kunciRows.forEach(row => {
                const barang = row.querySelector('.kunci-barang-input').value.trim();
                const kategori = row.querySelector('.kunci-kategori-input').value;
                const alasan = row.querySelector('.kunci-alasan-input').value.trim();
                if (barang) {
                    kunciJawaban.push({ barang, kategori, alasan });
                }
            });

            result.push({
                teks: inputs[i].value,
                uangSaku: parseInt(uangSakuInputs[i].value) || 20000,
                gender: genderInputs[i] ? genderInputs[i].value : 'L',
                fotos: fotos,
                kunciJawaban: kunciJawaban
            });
        }
        return result;
    }

    

    
    const btnSaveStory = document.getElementById('btnSaveStory');
    const saveStoryMsg = document.getElementById('saveStoryMsg');
    const btnResetUndian = document.getElementById('btnResetUndian');
    
    if (btnSaveStory) {
        btnSaveStory.addEventListener('click', async () => {
            const kumpulanCerita = collectCeritaInputs();
            const aturan = document.getElementById('aturanMain').value;
            const jumlahKel = document.getElementById('jumlahKelompok').value;
            
            if (kumpulanCerita.some(c => !c.teks.trim() || !c.uangSaku) || !aturan.trim() || !jumlahKel) {
                alert("Mohon lengkapi semua isian cerita, aturan, modal uang saku, dan jumlah kelompok!");
                return;
            }
            
            btnSaveStory.textContent = "Menyimpan...";
            await updateStorySettings(kumpulanCerita, aturan, jumlahKel);
            btnSaveStory.textContent = "Simpan Cerita & Kelompok";
            
            
            const sfxSave = new Audio('../benar.mp3');
            sfxSave.play().catch(e=>{});

            saveStoryMsg.classList.remove('hidden');
            setTimeout(() => {
                saveStoryMsg.classList.add('hidden');
            }, 3000);
        });
    }

    if (btnResetUndian) {
        btnResetUndian.addEventListener('click', async () => {
            if (confirm('Apakah Anda yakin ingin mereset undian? Semua kelompok akan mengundi ulang cerita mereka.')) {
                btnResetUndian.textContent = "Mereset...";
                await resetStoryAllocation();
                btnResetUndian.textContent = "Reset Undian Cerita";
                alert('Undian berhasil direset!');
            }
        });
    }

    
    const formTambahBarangToko = document.getElementById('formTambahBarangToko');
    const itemsGrid = document.getElementById('itemsGrid');

    if (formTambahBarangToko) {
        formTambahBarangToko.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnSubmit = formTambahBarangToko.querySelector('button');
            const originalText = btnSubmit.textContent;
            btnSubmit.textContent = 'Menyimpan... ⏳';
            btnSubmit.disabled = true;

            const inputToko = document.getElementById('inputToko').value;
            const inputNama = document.getElementById('inputNamaBarang').value;
            const inputHarga = document.getElementById('inputHargaBarang').value;
            const fileInput = document.getElementById('inputFotoBarang');
            const file = fileInput.files[0];

            if (!file) {
                alert('Pilih foto barang terlebih dahulu!');
                btnSubmit.textContent = originalText;
                btnSubmit.disabled = false;
                return;
            }

            try {
                
                let base64String = "";
                if (typeof resizeAndCompressImage === 'function') {
                    base64String = await resizeAndCompressImage(file);
                }

                
                const newItem = {
                    toko: inputToko,
                    nama: inputNama,
                    harga: parseInt(inputHarga),
                    fotoBase64: base64String,
                    uploader: 'guru', 
                    status: 'approved' 
                };

                await addItem(newItem);
                alert(`Barang ${inputNama} berhasil ditambahkan ke ${inputToko}!`);
                
                
                formTambahBarangToko.reset();
                renderItems(); 
            } catch (err) {
                console.error("Gagal menambah barang:", err);
                alert("Gagal menambahkan barang. Silakan coba lagi.");
            } finally {
                btnSubmit.textContent = originalText;
                btnSubmit.disabled = false;
            }
        });
    }

    function showGridLoading() {
        if(itemsGrid) itemsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 50px;">Memuat data dari Firebase... ⏳</p>';
    }

    async function renderItems() {
        if (!itemsGrid) return;
        
        if(itemsGrid.innerHTML === '') showGridLoading();
        
        const allItems = typeof getAllItems === 'function' ? await getAllItems() : [];
        itemsGrid.innerHTML = '';
        
        
        const itemsToRender = allItems.filter(item => item.uploader === 'guru');

        if (itemsToRender.length === 0) {
            itemsGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 50px;">Toko Anda masih kosong. Ayo tambahkan barang!</p>`;
        } else {
            itemsToRender.forEach((item) => {
                const card = document.createElement('div');
                card.className = 'photo-card';
                card.style.position = 'relative';
                             
                const fotoHtml = item.fotoBase64 
                    ? `<img src="${item.fotoBase64}" alt="${item.nama}">` 
                    : `<div style="display:flex; justify-content:center; align-items:center; height:100%; font-size:4rem;">📦</div>`;
                
                
                const categoryIcon = '🏪';
                const categoryText = item.toko || 'Toko Umum';
                
                
                const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.harga || 0);

                const buttonHtml = `
                    <button class="btn-delete" data-id="${item.id}" style="margin-top:10px; width:100%; background:var(--danger); border:none; color:white; padding:10px; border-radius:10px; cursor:pointer; font-weight:bold;">Hapus Barang 🗑️</button>`;

                card.innerHTML = `
                    <div class="photo-wrapper">
                        ${fotoHtml}
                        <div class="badge-pending" style="background:#8E44AD;">${categoryIcon} ${categoryText}</div>
                    </div>
                    <div class="card-content">
                        <h3>${item.nama}</h3>
                        <p class="student-name" style="color:var(--primary-color); font-weight:bold; font-size:1.1rem; margin-bottom:5px;">${formattedPrice}</p>
                        ${buttonHtml}
                    </div>
                `;
                
                itemsGrid.appendChild(card);
            });
            
            
            const deleteButtons = itemsGrid.querySelectorAll('.btn-delete');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const itemId = e.target.getAttribute('data-id');
                    if (confirm('Yakin ingin menghapus barang ini dari toko?')) {
                        const originalText = e.target.textContent;
                        e.target.textContent = 'Menghapus...';
                        e.target.disabled = true;
                        try {
                            if (typeof deleteItem === 'function') {
                                await deleteItem(itemId);
                                renderItems();
                            }
                        } catch (err) {
                            console.error('Gagal hapus item:', err);
                            alert('Gagal menghapus barang.');
                            e.target.textContent = originalText;
                            e.target.disabled = false;
                        }
                    }
                });
            });
        }
    }

    renderItems();

    
    const studentTabsContainer = document.getElementById('studentTabsContainer');
    const studentTabContentContainer = document.getElementById('studentTabContentContainer');
    const planTableBody = document.getElementById('planTableBody');
    
    let currentActiveTab = null;
    let previousEvalCount = 0; 

    function renderEvaluasiSiswa(results) {
        if (!studentTabsContainer || !studentTabContentContainer || !planTableBody || !results) return;
        
        planTableBody.innerHTML = '';
        
        const evalResults = results.filter(r => r.aktivitas !== "Perencanaan Keuangan");
        const planResults = results.filter(r => r.aktivitas === "Perencanaan Keuangan");
        
        
        if (evalResults.length > previousEvalCount) {
            
            if (evalResults[0]) {
                currentActiveTab = evalResults[0].nama;
            }
        }
        previousEvalCount = evalResults.length;
        
        
        if (evalResults.length === 0) {
            studentTabsContainer.innerHTML = '';
            studentTabContentContainer.innerHTML = `
                <div class="empty-tab-state">
                    <h3>Pilih nama siswa di atas untuk melihat laporan misinya!</h3>
                    <p>Data akan otomatis muncul jika ada siswa yang sudah bermain.</p>
                </div>
            `;
        } else {
            
            const groupedByStudent = {};
            evalResults.slice().reverse().forEach(r => {
                if (!groupedByStudent[r.nama]) {
                    groupedByStudent[r.nama] = [];
                }
                groupedByStudent[r.nama].push(r);
            });

            
            studentTabsContainer.innerHTML = '';
            const studentNames = Object.keys(groupedByStudent);
            
            studentNames.forEach((nama, index) => {
                const btn = document.createElement('button');
                btn.className = 'student-tab-btn';
                btn.textContent = nama;
                
                
                if (!currentActiveTab && index === 0) currentActiveTab = nama;
                
                if (currentActiveTab === nama) btn.classList.add('active');

                btn.onclick = () => {
                    currentActiveTab = nama;
                    
                    document.querySelectorAll('.student-tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderTabContent(nama, groupedByStudent[nama]);
                };

                studentTabsContainer.appendChild(btn);
            });

            
            if (currentActiveTab && groupedByStudent[currentActiveTab]) {
                renderTabContent(currentActiveTab, groupedByStudent[currentActiveTab]);
            } else if (studentNames.length > 0) {
                
                currentActiveTab = studentNames[0];
                studentTabsContainer.firstChild.classList.add('active');
                renderTabContent(studentNames[0], groupedByStudent[studentNames[0]]);
            }
        }
        
        function renderTabContent(studentName, historyArr) {
            let html = `<div class="student-results-grid">`;
            
            historyArr.forEach(r => {
                let badgeClass = r.aktivitas.toLowerCase().includes('kuis') ? 'kuis' : 'game';
                let emoji = r.aktivitas.toLowerCase().includes('kuis') ? '📝' : '🎮';
                
                let buttonHtml = '';
                if (r.izinLanjut === true) {
                    buttonHtml = `
                        <button disabled style="background:#e8f8f5; color:#2ecc71; border:2px solid #2ecc71; padding:8px 12px; border-radius:5px; cursor:not-allowed; font-weight:bold; box-shadow:none;">✅ Telah Diizinkan</button>
                    `;
                } else {
                    buttonHtml = `
                        <button onclick="izinkanSiswa('${studentName}', this)" style="background:#2ecc71; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.2);">✅ Izinkan Lanjut Misi</button>
                    `;
                }

                html += `
                    <div class="mission-result-card ${badgeClass}">
                        <div class="mission-header">
                            <span class="mission-badge ${badgeClass}">${emoji} ${r.aktivitas}</span>
                            <span class="mission-date">${r.waktu}</span>
                        </div>
                        <div class="mission-score">${r.skorAkhir}</div>
                        <div class="mission-notes">
                            <strong>Catatan:</strong><br>
                            ${r.catatan}
                        </div>
                        <div style="text-align: right; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.1);">
                            ${buttonHtml}
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
            studentTabContentContainer.innerHTML = html;
        }
        
        
        if (planResults.length === 0) {
            planTableBody.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 20px;">Belum ada siswa yang mengirim laporan perencanaan keuangan.</td></tr>';
        } else {
            planResults.slice().reverse().forEach((r) => {
                const tr = document.createElement('tr');
                
                
                
                let uangSaku = "-";
                let status = "-";
                let rincian = r.catatan; 
                
                if(r.catatan.includes('<strong>Uang Saku:</strong>')) {
                    const parts = r.catatan.split('<br>');
                    if(parts.length >= 3) {
                        uangSaku = parts[0].replace('<strong>Uang Saku:</strong>', '').trim();
                        status = parts[1].replace('<strong>Status:</strong>', '').trim();
                        
                        rincian = parts.slice(2).join('<br>').replace('<strong>Rincian Jajan:</strong>', '').trim();
                    }
                }
                
                
                let statusColor = "color: #333;";
                if(status.includes("Aman")) statusColor = "color: #27AE60; font-weight:bold;";
                if(status.includes("Minus")) statusColor = "color: #E74C3C; font-weight:bold;";
                
                tr.innerHTML = `
                    <td style="vertical-align: top;">${r.waktu}</td>
                    <td style="vertical-align: top; font-weight:bold; color:#27AE60;">${r.nama}</td>
                    <td style="vertical-align: top;">${r.kelas}</td>
                    <td style="vertical-align: top; font-weight:bold;">${uangSaku}</td>
                    <td style="vertical-align: top; font-weight:bold; color:var(--danger);">${r.skorAkhir}</td>
                    <td style="vertical-align: top; ${statusColor}">${status}</td>
                    <td style="vertical-align: top; text-align:left;">${rincian}</td>
                `;
                planTableBody.appendChild(tr);
            });
        }
    }

    if (typeof listenToStudentResults === 'function') {
        const studentTabContentContainer = document.getElementById('studentTabContentContainer');
        if(studentTabContentContainer) studentTabContentContainer.innerHTML = '<div class="empty-tab-state"><h3>Menghubungkan ke database real-time...</h3></div>';
        planTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Menghubungkan ke database real-time...</td></tr>';
        listenToStudentResults((results) => {
            renderEvaluasiSiswa(results);
        });
    }

    
    const btnClearEval = document.getElementById('btnClearEval');
    if (btnClearEval) {
        btnClearEval.addEventListener('click', async () => {
            if (confirm('Yakin ingin menghapus data Kuis/Evaluasi? (Data Perencanaan mungkin ikut terhapus di sistem ini)')) {
                btnClearEval.textContent = "Menghapus...";
                await clearStudentResults();
                btnClearEval.textContent = "Hapus Riwayat Kuis";
            }
        });
    }
    
    
    const btnClearPlan = document.getElementById('btnClearPlan');
    if (btnClearPlan) {
        btnClearPlan.addEventListener('click', async () => {
            if (confirm('Yakin ingin menghapus seluruh data Laporan Perencanaan?')) {
                btnClearPlan.textContent = "Menghapus...";
                await clearStudentResults(); 
                btnClearPlan.textContent = "Hapus Data Laporan";
            }
        });
    }

    
    const liveMonitorGrid = document.getElementById('liveMonitorGrid');
    const activeCountBadge = document.getElementById('activeCountBadge');

    if (liveMonitorGrid && typeof listenToPresence === 'function') {
        listenToPresence((activeStudents) => {
            
            if (activeCountBadge) {
                activeCountBadge.textContent = `${activeStudents.length} Siswa Online`;
            }

            if (activeStudents.length === 0) {
                liveMonitorGrid.innerHTML = `<p style="color: #95A5A6; width: 100%; text-align: center; padding: 20px;">Belum ada siswa yang terdeteksi online saat ini.</p>`;
                return;
            }

            
            liveMonitorGrid.innerHTML = '';
            activeStudents.forEach(student => {
                const card = document.createElement('div');
                card.style.cssText = `
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 10px;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    width: calc(33.333% - 10px);
                    min-width: 200px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                `;

                
                const pingDot = `
                    <div style="position: relative; width: 12px; height: 12px;">
                        <div style="position: absolute; width: 100%; height: 100%; background: #2ecc71; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                        <div style="position: absolute; width: 100%; height: 100%; background: #27ae60; border-radius: 50%;"></div>
                    </div>
                `;

                
                const diffMin = Math.floor((Date.now() - student.lastActive) / 60000);
                const timeText = diffMin < 1 ? "Aktif" : `${diffMin} mnt lalu`;

                card.innerHTML = `
                    ${pingDot}
                    <div style="flex: 1; overflow: hidden;">
                        <div style="font-weight: bold; color: #2c3e50; font-size: 1.1rem; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${student.nama}</div>
                        <div style="font-size: 0.85rem; color: #7f8c8d;">Kelas ${student.kelas} • <span style="color:#27ae60;">${timeText}</span></div>
                    </div>
                `;
                liveMonitorGrid.appendChild(card);
            });
        });
        
        
        if (!document.getElementById('pingAnimation')) {
            const style = document.createElement('style');
            style.id = 'pingAnimation';
            style.innerHTML = `
                @keyframes ping {
                    75%, 100% { transform: scale(2.5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    
    const activityLogTableBody = document.getElementById('activityLogTableBody');
    const btnClearActivityLogs = document.getElementById('btnClearActivityLogs');

    function renderActivityLogs(logs) {
        if (!activityLogTableBody || !logs) return;

        activityLogTableBody.innerHTML = '';
        
        if (logs.length === 0) {
            activityLogTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#95A5A6;">Belum ada aktivitas siswa yang terekam.</td></tr>';
            return;
        }

        logs.forEach(log => {
            const tr = document.createElement('tr');
            const arrAktivitas = log.aktivitasList || (log.aktivitas ? [log.aktivitas] : []);
            const tags = arrAktivitas.map(act => `<span style="background: #E8F8F5; color: #16A085; padding: 4px 10px; border-radius: 15px; font-size: 0.85rem; font-weight: bold; display: inline-block; margin: 2px;">${act}</span>`).join('');
            
            tr.innerHTML = `
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-size: 0.9rem; color: #7F8C8D;">${log.waktu}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #2C3E50;">${log.namaSiswa}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #2980B9; font-weight: bold;">${log.kelasSiswa}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    ${tags}
                </td>
            `;
            activityLogTableBody.appendChild(tr);
        });
    }

    if (typeof listenToActivityLogs === 'function') {
        activityLogTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#95A5A6;">Menghubungkan ke radar aktivitas real-time... ⏳</td></tr>';
        listenToActivityLogs((logs) => {
            renderActivityLogs(logs);
        });
    }

    if (btnClearActivityLogs) {
        btnClearActivityLogs.addEventListener('click', async () => {
            if (confirm('Yakin ingin membersihkan SEMUA rekam jejak aktivitas siswa? (Ini tidak akan menghapus skor kuis)')) {
                btnClearActivityLogs.textContent = "Menghapus...";
                await clearActivityLogs();
                btnClearActivityLogs.textContent = "Bersihkan Log";
            }
        });
    }

});





document.addEventListener('DOMContentLoaded', () => {
    const btnEditProfile = document.getElementById('btnEditProfile');
    const profileModal = document.getElementById('profileModal');
    const btnCancelProfile = document.getElementById('btnCancelProfile');
    const btnSaveProfile = document.getElementById('btnSaveProfile');
    const inputAvatarUpload = document.getElementById('inputAvatarUpload');
    const previewAvatar = document.getElementById('previewAvatar');
    
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarName = document.getElementById('sidebarName');
    const sidebarRole = document.getElementById('sidebarRole');
    
    const inputProfileName = document.getElementById('inputProfileName');
    const inputProfileRole = document.getElementById('inputProfileRole');

    
    function loadProfile() {
        const savedProfile = localStorage.getItem('guruCustomProfile');
        if (savedProfile) {
            const data = JSON.parse(savedProfile);
            if (data.name) sidebarName.textContent = data.name;
            if (data.role) sidebarRole.textContent = data.role;
            if (data.avatar) sidebarAvatar.src = data.avatar;
        }
    }

    
    loadProfile();

    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', () => {
            
            inputProfileName.value = sidebarName.textContent;
            inputProfileRole.value = sidebarRole.textContent;
            previewAvatar.src = sidebarAvatar.src;
            
            profileModal.style.display = 'flex';
        });
    }

    if (btnCancelProfile) {
        btnCancelProfile.addEventListener('click', () => {
            profileModal.style.display = 'none';
        });
    }

    
    if (inputAvatarUpload) {
        inputAvatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    previewAvatar.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnSaveProfile) {
        btnSaveProfile.addEventListener('click', () => {
            const newName = inputProfileName.value.trim();
            const newRole = inputProfileRole.value.trim();
            const newAvatar = previewAvatar.src; 

            if (!newName) {
                alert('Nama tidak boleh kosong!');
                return;
            }

            const profileData = {
                name: newName,
                role: newRole,
                avatar: newAvatar
            };

            
            localStorage.setItem('guruCustomProfile', JSON.stringify(profileData));

            
            sidebarName.textContent = newName;
            sidebarRole.textContent = newRole;
            sidebarAvatar.src = newAvatar;

            profileModal.style.display = 'none';
            alert('Profil berhasil diperbarui!');
        });
    }
});





document.addEventListener('DOMContentLoaded', async () => {
    const inputKuisMenit = document.getElementById('inputKuisMenit');
    const inputKuisDetik = document.getElementById('inputKuisDetik');
    const btnSimpanWaktuKuis = document.getElementById('btnSimpanWaktuKuis');

    
    if (typeof getSettings === 'function' && inputKuisMenit) {
        try {
            const settings = await getSettings();
            let totalDetik = settings.waktuKuis || 120; 
            
            const m = Math.floor(totalDetik / 60);
            const s = totalDetik % 60;
            
            inputKuisMenit.value = m;
            inputKuisDetik.value = s;
            
        } catch (e) {
            console.error("Gagal memuat waktu kuis", e);
        }

        btnSimpanWaktuKuis.addEventListener('click', async () => {
            const m = parseInt(inputKuisMenit.value) || 0;
            const s = parseInt(inputKuisDetik.value) || 0;
            const totalDetik = (m * 60) + s;
            
            if (totalDetik < 10) {
                alert("Waktu terlalu singkat! Minimal 10 detik.");
                return;
            }

            const originalText = btnSimpanWaktuKuis.textContent;
            btnSimpanWaktuKuis.textContent = "Menyimpan...";
            btnSimpanWaktuKuis.disabled = true;

            await updateWaktuKuis(totalDetik);
            
            btnSimpanWaktuKuis.textContent = "Tersimpan!";
            setTimeout(() => {
                btnSimpanWaktuKuis.textContent = originalText;
                btnSimpanWaktuKuis.disabled = false;
            }, 2000);
        });
    }
});


window.izinkanSiswa = async function(namaSiswa, btnElement) {
    if (typeof db === 'undefined') {
        alert("Firestore tidak tersedia. Pastikan koneksi internet aktif.");
        return;
    }

    let originalBtnText = "";
    let originalBtnBg = "";
    if (btnElement) {
        btnElement.disabled = true;
        originalBtnText = btnElement.textContent;
        originalBtnBg = btnElement.style.backgroundColor || btnElement.style.background;
        btnElement.textContent = "⌛ Memproses...";
        btnElement.style.background = "#95a5a6";
    }

    const restoreBtn = () => {
        if (btnElement) {
            btnElement.disabled = false;
            btnElement.textContent = originalBtnText;
            btnElement.style.background = originalBtnBg;
        }
    };

    
    const updateResultIzin = async () => {
        try {
            const resultsQuery = await db.collection('studentResults')
                .where('nama', '==', namaSiswa)
                .where('aktivitas', '==', 'Mini-Game Belanja')
                .get();
            if (!resultsQuery.empty) {
                let latestResultDoc = null;
                let latestTimestamp = 0;
                resultsQuery.forEach(doc => {
                    const data = doc.data();
                    const ts = data.timestamp || 0;
                    if (ts > latestTimestamp) {
                        latestTimestamp = ts;
                        latestResultDoc = doc;
                    }
                });
                if (latestResultDoc) {
                    await db.collection('studentResults').doc(latestResultDoc.id).update({ izinLanjut: true });
                }
            }
        } catch(err) {
            console.error("Gagal mengupdate studentResults:", err);
        }
    };
    
    try {
        const querySnapshot = await db.collection('perencanaan')
            .where('namaSiswa', '==', namaSiswa)
            .orderBy('tanggal', 'desc')
            .limit(1)
            .get();

        if (querySnapshot.empty) {
            
            const fallbackQuery = await db.collection('perencanaan')
                .where('namaSiswa', '==', namaSiswa)
                .get();
                
            if (fallbackQuery.empty) {
                alert(`Tidak dapat menemukan data perencanaan untuk siswa: ${namaSiswa}`);
                restoreBtn();
                return;
            }
            
            
            let latestDoc = null;
            let latestTime = 0;
            fallbackQuery.forEach(doc => {
                const data = doc.data();
                const time = data.tanggal ? data.tanggal.toMillis() : 0;
                if (time > latestTime) {
                    latestTime = time;
                    latestDoc = doc;
                }
            });
            
            if (latestDoc) {
                await db.collection('perencanaan').doc(latestDoc.id).update({ izinLanjut: true });
                await updateResultIzin();
                alert(`Izin telah diberikan kepada ${namaSiswa} (Fallback Mode)!`);
            } else {
                restoreBtn();
            }
        } else {
            const docId = querySnapshot.docs[0].id;
            await db.collection('perencanaan').doc(docId).update({ izinLanjut: true });
            await updateResultIzin();
            alert(`Izin telah diberikan kepada ${namaSiswa}! Mereka sekarang bisa melanjutkan perjalanan.`);
        }
    } catch (e) {
        console.error("Error memberikan izin (query utama):", e);
        
        try {
            const fallbackQuery = await db.collection('perencanaan')
                .where('namaSiswa', '==', namaSiswa)
                .get();
                
            if (fallbackQuery.empty) {
                alert(`Tidak dapat menemukan data perencanaan untuk siswa: ${namaSiswa}`);
                restoreBtn();
                return;
            }
                
            let latestDoc = null;
            let latestTime = 0;
            fallbackQuery.forEach(doc => {
                const data = doc.data();
                const time = data.tanggal ? (data.tanggal.toMillis ? data.tanggal.toMillis() : 0) : 0;
                if (time >= latestTime) {
                    latestTime = time;
                    latestDoc = doc;
                }
            });
            
            if (latestDoc) {
                await db.collection('perencanaan').doc(latestDoc.id).update({ izinLanjut: true });
                await updateResultIzin();
                alert(`Izin telah diberikan kepada ${namaSiswa} (Fallback Mode)! Mereka sekarang bisa melanjutkan perjalanan.`);
                return;
            } else {
                
                const firstDoc = fallbackQuery.docs[0];
                await db.collection('perencanaan').doc(firstDoc.id).update({ izinLanjut: true });
                await updateResultIzin();
                alert(`Izin telah diberikan kepada ${namaSiswa} (Emergency Mode)!`);
                return;
            }
        } catch(fallbackErr) {
            console.error("Error di fallback:", fallbackErr);
            alert("Gagal memberikan izin. Lihat console untuk detail. Pesan Error: " + fallbackErr.message);
            restoreBtn();
        }
    }
};
