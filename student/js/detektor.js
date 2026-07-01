

document.addEventListener('DOMContentLoaded', () => {
    
    
    
    
    const sfxClick = new Audio('../klik kuis.mp3');
    const sfxKebutuhan = new Audio('../benar.mp3');
    const sfxKeinginan = new Audio('../salah.mp3');
    const sfxPop = new Audio('../klik kuis.mp3'); 
    sfxPop.volume = 0.5;

    function playSound(audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio play failed:", e));
    }

    
    
    
    const btnModeInstan = document.getElementById('btnModeInstan');
    const btnModeDetektif = document.getElementById('btnModeDetektif');
    const cardInstan = document.getElementById('cardInstan');
    const cardDetektif = document.getElementById('cardDetektif');

    btnModeInstan.addEventListener('click', () => {
        playSound(sfxClick);
        btnModeInstan.classList.add('active');
        btnModeDetektif.classList.remove('active');
        cardInstan.classList.add('active');
        cardDetektif.classList.remove('active');
    });

    btnModeDetektif.addEventListener('click', () => {
        playSound(sfxClick);
        btnModeDetektif.classList.add('active');
        btnModeInstan.classList.remove('active');
        cardDetektif.classList.add('active');
        cardInstan.classList.remove('active');
    });

    
    
    
    const inputNama = document.getElementById('inputNamaBarang');
    const inputFungsi = document.getElementById('inputFungsiBarang');
    const btnProsesInstan = document.getElementById('btnProsesInstan');
    const hasilInstan = document.getElementById('hasilInstan');
    const statusRencana = document.getElementById('statusRencana');

    
    if (typeof logActivity === 'function') {
        logActivity('🧮 Mulai membuat Perencanaan Keuangan');
    }

    
    const kataKunciKeinginan = ['main', 'game', 'gaya', 'hiburan', 'lucu', 'keren', 'jalan', 'koleksi', 'pajangan', 'nongkrong', 'iseng', 'bosen', 'gabut', 'ikut', 'biar sama', 'pengen', 'cuma', 'healing', 'nonton', 'pesta', 'jajan', 'ngemil', 'biar dibilang', 'kado', 'hadiah', 'koleksi', 'menghias', 'mabar'];
    const kataKunciKebutuhan = ['belajar', 'sekolah', 'makan', 'minum', 'sakit', 'obat', 'tugas', 'seragam', 'buku', 'penting', 'wajib', 'nulis', 'menulis', 'menggambar', 'menghitung', 'baca', 'membaca', 'disuruh', 'guru', 'pr ', 'latihan', 'kenyang', 'sembuh', 'berobat', 'ongkos', 'transport', 'sarapan', 'lks', 'cetak'];

    
    const isLocal = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isLocal ? 'http://localhost:3000/api/chat' : '/api/chat';

    btnProsesInstan.addEventListener('click', async () => {
        playSound(sfxClick);
        const usiaSiswa = parseInt(document.getElementById('inputUsiaSiswa').value);
        if (!usiaSiswa || usiaSiswa < 5) {
            alert('Mohon isi usiamu terlebih dahulu di bagian atas!');
            return;
        }

        const nama = inputNama.value.trim();
        const fungsi = inputFungsi.value.trim();

        if (!nama || !fungsi) {
            alert('Mohon isi nama barang dan fungsinya terlebih dahulu!');
            return;
        }

        
        if (typeof logActivity === 'function') {
            logActivity('Deteksi Barang: ' + nama);
        }

        
        btnProsesInstan.disabled = true;
        btnProsesInstan.innerHTML = 'Memindai... ⏳';
        hasilInstan.classList.remove('result-kebutuhan', 'result-keinginan');
        hasilInstan.style.display = 'block';
        hasilInstan.innerHTML = '<div style="text-align:center; color:#7F8C8D;"><i>Mesin Detektor AI sedang menganalisis... 🤖</i></div>';

        try {
            const systemPrompt = `Kamu adalah mesin Detektor Kekei (Kebutuhan vs Keinginan).
DATA PENTING: Anak ini berusia ${usiaSiswa} tahun. 
Tugasmu: Tentukan apakah barang ini Kebutuhan pokok atau murni Keinginan. Pertimbangkan usia anak (${usiaSiswa} tahun) secara logis. Barang mewah/tersier (seperti iPhone, PS5, perhiasan, skin game) BUKANLAH kebutuhan pokok untuk anak usia ini, meskipun mereka beralasan sangat butuh atau belum punya. Itu adalah KEINGINAN murni.
Berikan jawaban singkat, kritis, logis, tapi tetap ramah.
WAJIB AWALI jawabanmu dengan persis kata 'KEBUTUHAN:' atau 'KEINGINAN:' (huruf kapital), lalu jelaskan alasannya di kalimat berikutnya.`;
            const userText = 'Barang yang ingin dibeli: ' + nama + '. Alasan/Fungsinya: ' + fungsi;

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText, systemPrompt: systemPrompt })
            });

            const data = await response.json();
            const reply = data.reply.trim();

            
            let isKebutuhan = false;
            let finalMessage = reply;

            if (reply.toUpperCase().startsWith('KEBUTUHAN')) {
                isKebutuhan = true;
                finalMessage = reply.substring(reply.indexOf(':') + 1).trim();
            } else if (reply.toUpperCase().startsWith('KEINGINAN')) {
                isKebutuhan = false;
                finalMessage = reply.substring(reply.indexOf(':') + 1).trim();
            } else {
                
                isKebutuhan = reply.toLowerCase().includes('kebutuhan');
            }

            if (isKebutuhan) {
                hasilInstan.classList.add('result-kebutuhan');
                hasilInstan.innerHTML = '✅ <b>Kebutuhan!</b><br>' + finalMessage;
            } else {
                hasilInstan.classList.add('result-keinginan');
                hasilInstan.innerHTML = '❌ <b>Keinginan!</b><br>' + finalMessage;
            }
        } catch (error) {
            console.error('Detektor API Error:', error);
            hasilInstan.innerHTML = '⚠️ <b>Koneksi Terputus!</b><br>Mesin detektor gagal menghubungi pusat AI. Coba lagi nanti.';
        } finally {
            btnProsesInstan.disabled = false;
            btnProsesInstan.innerHTML = 'Analisis Sekarang!';
        }
    });

    
    
    
    const chatArea = document.getElementById('chatArea');
    const chatInputArea = document.getElementById('chatInputArea');
    const chatInput = document.getElementById('chatInput');
    const btnKirimChat = document.getElementById('btnKirimChat');
    const chatActionArea = document.getElementById('chatActionArea');
    const btnJawabYa = document.getElementById('btnJawabYa');
    const btnJawabTidak = document.getElementById('btnJawabTidak');
    const btnUlangiDetektif = document.getElementById('btnUlangiDetektif');

    let stateDetektif = 0; 
    let barangDetektif = "";
    let poinKebutuhan = 0;

    
    function tambahPesan(pesan, pengirim) {
        playSound(sfxPop); 
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${pengirim === 'bot' ? 'chat-bot' : 'chat-user'}`;
        bubble.innerHTML = pesan;
        chatArea.appendChild(bubble);
        
        
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    
    function tambahPesanBotDenganTyping(pesan, callback = null) {
        
        const typingBubble = document.createElement('div');
        typingBubble.className = 'chat-bubble chat-bot';
        typingBubble.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatArea.appendChild(typingBubble);
        chatArea.scrollTop = chatArea.scrollHeight;

        
        setTimeout(() => {
            chatArea.removeChild(typingBubble);
            tambahPesan(pesan, 'bot');
            if (callback) callback();
        }, 1500);
    }

    
    
    
    let chatHistory = [];
    let isWaitingForAI = false;

    
    async function callAIDetektif(usia) {
        
        const typingBubble = document.createElement('div');
        typingBubble.className = 'chat-bubble chat-bot';
        typingBubble.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
        chatArea.appendChild(typingBubble);
        chatArea.scrollTop = chatArea.scrollHeight;

        try {
            
            let contextStr = chatHistory.map(msg => msg.role === 'user' ? "Anak: " + msg.content : "Detektif: " + msg.content).join("\n");
            
            const systemPrompt = `Kamu adalah Robot Detektif cerdas (Kebutuhan vs Keinginan).
DATA PENTING: Anak ini berusia ${usia} tahun. Pertimbangkan usianya secara logis! Barang mewah/tersier (iPhone, PS5, motor, makeup mahal) BUKANLAH kebutuhan pokok untuk anak usia ${usia} tahun, melainkan KEINGINAN murni. Jangan mudah dibohongi jika anak beralasan "saya butuh" atau "karena saya belum punya".

Aturan Main:
1. Kamu sedang menginvestigasi secara mendalam barang yang ingin dibeli anak ini.
2. Jika barangnya mahal atau tidak wajar, KEJAR TERUS alasannya. Tanyakan pertanyaan kritis untuk menguji kebenaran "kebutuhan" tersebut (bisa pertanyaan terbuka atau tertutup Ya/Tidak).
3. Ajukan 1 pertanyaan kritis per giliran.
4. DILARANG menggunakan narasi gerak-gerik/aksi (seperti *menatap*, *tersenyum*, dll). Cukup tanyakan langsung dengan bahasa ramah anak.
5. Jika kamu sudah mengumpulkan cukup bukti/alasan (biasanya 2-4 putaran), tarik KESIMPULAN AKHIR.
6. Awali kalimat kesimpulan akhirmu HANYA dengan kata persis 'KEBUTUHAN!' atau 'KEINGINAN!' lalu jelaskan alasannya berdasarkan usia ${usia} tahun.

Riwayat Chat Saat Ini:\n` + contextStr;

            const payload = {
                message: "Lanjutkan interogasi detektifmu.",
                systemPrompt: systemPrompt
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            const reply = data.reply.trim();

            chatArea.removeChild(typingBubble);
            tambahPesan(reply, 'bot');
            chatHistory.push({ role: 'bot', content: reply });

            
            if (reply.toUpperCase().includes('KEBUTUHAN!') || reply.toUpperCase().includes('KEINGINAN!')) {
                btnUlangiDetektif.style.display = 'inline-block';
                chatActionArea.style.display = 'none'; 
                chatInputArea.style.display = 'none'; 
            } else {
                
                chatActionArea.style.display = 'flex'; 
                chatInputArea.style.display = 'flex'; 
            }

        } catch (error) {
            console.error(error);
            chatArea.removeChild(typingBubble);
            tambahPesan("Aduh, radar AI sedang terputus! Coba lagi ya.", 'bot');
            chatActionArea.style.display = 'flex';
            chatInputArea.style.display = 'flex';
        } finally {
            isWaitingForAI = false;
        }
    }

    
    btnKirimChat.addEventListener('click', async () => {
        if (isWaitingForAI) return;

        const usiaSiswa = parseInt(document.getElementById('inputUsiaSiswa').value);
        if (!usiaSiswa || usiaSiswa < 5) {
            alert('Mohon isi usiamu terlebih dahulu di bagian atas!');
            return;
        }

        const teks = chatInput.value.trim();
        if (!teks) return;

        tambahPesan(teks, 'user');
        chatInput.value = "";
        
        
        chatInputArea.style.display = 'none';
        chatActionArea.style.display = 'none';
        
        if (chatHistory.length === 0) {
            chatHistory.push({ role: 'user', content: "Aku ingin membeli: " + teks });
            if (typeof logActivity === 'function') logActivity('Mulai Investigasi AI: ' + teks);
        } else {
            chatHistory.push({ role: 'user', content: teks });
        }
        
        isWaitingForAI = true;
        await callAIDetektif(usiaSiswa);
    });

    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btnKirimChat.click();
    });

    
    async function prosesJawaban(isYa) {
        if (isWaitingForAI) return;
        playSound(sfxClick);
        
        const usiaSiswa = parseInt(document.getElementById('inputUsiaSiswa').value);
        const teksJawaban = isYa ? "Ya" : "Tidak";
        
        tambahPesan(isYa ? "Tentu Saja (Ya)" : "Sebenarnya Tidak", 'user');
        
        
        chatInputArea.style.display = 'none';
        chatActionArea.style.display = 'none';
        
        chatHistory.push({ role: 'user', content: teksJawaban });
        isWaitingForAI = true;

        await callAIDetektif(usiaSiswa);
    }

    btnJawabYa.addEventListener('click', () => prosesJawaban(true));
    btnJawabTidak.addEventListener('click', () => prosesJawaban(false));

    
    btnUlangiDetektif.addEventListener('click', () => {
        playSound(sfxClick);
        chatHistory = [];
        
        
        chatArea.innerHTML = `
            <div class="chat-bubble chat-bot">
                Bip Bop! <img src="aset%20student/icon-kekei.png" alt="Robot Kekei" style="height: 35px; width: auto; vertical-align: middle; margin: 0 2px;"> Halo! Aku Robot Detektif. Sebutkan satu nama barang yang ingin kamu beli!
            </div>
        `;
        
        btnUlangiDetektif.style.display = 'none';
        chatActionArea.style.display = 'none';
        chatInputArea.style.display = 'flex'; 
    });

});