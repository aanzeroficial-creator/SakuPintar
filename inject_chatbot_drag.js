const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/shared/js/chatbot.js', 'utf8');

const dragLogic = `
    // --- LOGIKA DRAG & DROP UNTUK TOMBOL CHATBOT ---
    let isDraggingBot = false;
    let didDragBot = false; // Membedakan antara click dan drag
    let startXBot, startYBot, initialXBot, initialYBot;

    const dragStartBot = (e) => {
        if (e.target.closest('#chatbot-close')) return; // Jangan drag jika klik tombol close (meskipun tombol close ada di dalam window, bukan toggle, ini hanya berjaga-jaga)
        
        isDraggingBot = true;
        didDragBot = false;
        const event = e.type.includes('touch') ? e.touches[0] : e;
        startXBot = event.clientX;
        startYBot = event.clientY;
        
        const rect = toggleBtn.getBoundingClientRect();
        initialXBot = rect.left;
        initialYBot = rect.top;
        
        toggleBtn.style.transition = 'none'; // Matikan transisi saat drag biar responsif
        // Ubah dari bottom/right ke top/left agar lebih mudah dihitung
        toggleBtn.style.bottom = 'auto';
        toggleBtn.style.right = 'auto';
        toggleBtn.style.left = initialXBot + 'px';
        toggleBtn.style.top = initialYBot + 'px';
    };

    const dragBot = (e) => {
        if (!isDraggingBot) return;
        
        const event = e.type.includes('touch') ? e.touches[0] : e;
        const dx = event.clientX - startXBot;
        const dy = event.clientY - startYBot;
        
        // Jika bergeser lebih dari 5px, anggap sedang didrag (bukan diklik)
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            didDragBot = true;
            if(e.cancelable) e.preventDefault(); // Mencegah scroll layar di HP
        }

        if (!didDragBot) return;

        let newX = initialXBot + dx;
        let newY = initialYBot + dy;
        
        // Batasi agar tidak keluar dari viewport
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + toggleBtn.offsetWidth > window.innerWidth) newX = window.innerWidth - toggleBtn.offsetWidth;
        if (newY + toggleBtn.offsetHeight > window.innerHeight) newY = window.innerHeight - toggleBtn.offsetHeight;

        toggleBtn.style.left = newX + 'px';
        toggleBtn.style.top = newY + 'px';
    };

    const dragEndBot = (e) => {
        if (!isDraggingBot) return;
        isDraggingBot = false;
        toggleBtn.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // Kembalikan transisi bawaan
        
        // Jika ternyata ini drag, cegah aksi klik dengan menangkap event click yang akan terjadi setelah mouseup
        if (didDragBot) {
            // Kita sudah menandai didDragBot = true
        }
    };

    toggleBtn.addEventListener('mousedown', dragStartBot);
    toggleBtn.addEventListener('touchstart', dragStartBot, {passive: false});
    
    document.addEventListener('mousemove', dragBot, {passive: false});
    document.addEventListener('touchmove', dragBot, {passive: false});
    
    document.addEventListener('mouseup', dragEndBot);
    document.addEventListener('touchend', dragEndBot);
    // ------------------------------------------------
`;

const clickLogicOld = `    // 4. FUNGSI BUKA / TUTUP CHAT
    toggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');`;

const clickLogicNew = `    // 4. FUNGSI BUKA / TUTUP CHAT
    toggleBtn.addEventListener('click', (e) => {
        // Cegah buka chat jika pengguna baru saja selesai men-drag tombolnya
        if (didDragBot) {
            e.preventDefault();
            didDragBot = false; // Reset
            return;
        }
        chatWindow.classList.toggle('active');`;

if (!js.includes('LOGIKA DRAG & DROP UNTUK TOMBOL CHATBOT')) {
    js = js.replace('// 4. FUNGSI BUKA / TUTUP CHAT', dragLogic + '\n    // 4. FUNGSI BUKA / TUTUP CHAT');
    js = js.replace(clickLogicOld, clickLogicNew);
    fs.writeFileSync('d:/New folder (3)/shared/js/chatbot.js', js);
    console.log("Chatbot drag logic injected!");
} else {
    console.log("Already exists");
}
