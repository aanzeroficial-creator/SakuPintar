const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/shared/js/chatbot.js', 'utf8');

const positionLogic = `
    function updateChatWindowPosition() {
        if (!chatWindow.classList.contains('active')) return;
        const btnRect = toggleBtn.getBoundingClientRect();
        
        // Asumsikan ukuran chatWindow (jika display none mungkin perlu trik, tapi karena visibility/opacity dipakai, bounding client rect bisa)
        chatWindow.style.bottom = 'auto';
        chatWindow.style.right = 'auto';
        
        const winWidth = chatWindow.offsetWidth || 350;
        const winHeight = chatWindow.offsetHeight || 500;
        
        // Default: taruh di atas tombol, rata kanan dengan tombol
        let newTop = btnRect.top - winHeight - 15;
        let newLeft = btnRect.right - winWidth;

        // Jika keluar atas, pindah ke bawah tombol
        if (newTop < 0) {
            newTop = btnRect.bottom + 15;
        }
        
        // Jika keluar kiri, geser ke kanan rata kiri dengan tombol
        if (newLeft < 0) {
            newLeft = btnRect.left;
        }

        // Jika masih keluar kanan (misal di-drag ke pojok kanan banget tapi newLeft = btnRect.left), amankan:
        if (newLeft + winWidth > window.innerWidth) {
            newLeft = window.innerWidth - winWidth - 15;
        }

        chatWindow.style.top = newTop + 'px';
        chatWindow.style.left = newLeft + 'px';
    }
`;

const toggleLogicOld = `chatWindow.classList.toggle('active');`;
const toggleLogicNew = `chatWindow.classList.toggle('active');\n        updateChatWindowPosition();`;

const dragLogicOld = `toggleBtn.style.top = newY + 'px';
    };`;
const dragLogicNew = `toggleBtn.style.top = newY + 'px';
        updateChatWindowPosition(); // Biar window ngikutin saat di-drag kalau lagi kebuka
    };`;

if (!js.includes('updateChatWindowPosition')) {
    js = positionLogic + '\n' + js;
    js = js.replace(toggleLogicOld, toggleLogicNew);
    js = js.replace(dragLogicOld, dragLogicNew);
    
    
    
    fs.writeFileSync('d:/New folder (3)/shared/js/chatbot.js', js);
    console.log("Position logic injected!");
} else {
    console.log("Already exists");
}
