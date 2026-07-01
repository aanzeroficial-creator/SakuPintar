
function updateChatWindowPosition() {
    if (!chatWindow.classList.contains('active')) return;
    const btnRect = toggleBtn.getBoundingClientRect();


    chatWindow.style.bottom = 'auto';
    chatWindow.style.right = 'auto';

    const winWidth = chatWindow.offsetWidth || 350;
    const winHeight = chatWindow.offsetHeight || 500;


    let newTop = btnRect.top - winHeight - 15;
    let newLeft = btnRect.right - winWidth;


    if (newTop < 0) {
        newTop = btnRect.bottom + 15;
    }


    if (newLeft < 0) {
        newLeft = btnRect.left;
    }


    if (newLeft + winWidth > window.innerWidth) {
        newLeft = window.innerWidth - winWidth - 15;
    }

    chatWindow.style.top = newTop + 'px';
    chatWindow.style.left = newLeft + 'px';
}



document.addEventListener('DOMContentLoaded', () => {


    const isLocal = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isLocal ? 'http://localhost:3000/api/chat' : '/api/chat';


    const SYSTEM_PROMPT = "Kamu adalah Fin AI, robot pintar, lucu, dan ramah yang membantu anak Sekolah Dasar (SD) belajar tentang uang, menabung, kebutuhan vs keinginan, dan literasi finansial dasar. Selalu jawab dengan singkat (maksimal 2 paragraf pendek), gunakan bahasa Indonesia yang sangat mudah dipahami anak-anak, dan gunakan banyak emoji lucu. Jangan memberikan jawaban yang rumit atau matematis berat. Jika ditanya hal di luar literasi keuangan, arahkan kembali ke topik uang dengan ramah.";


    let chatHistory = [];


    const chatbotHTML = `
        <!-- Tombol Mengambang -->
        <button id="chatbot-toggle" title="Tanya Bot Keuangan">
            <img src="../shared/assets/fin-ai-icon.png" alt="Fin AI" style="width: 100%; height: 100%; object-fit: contain;">
        </button>

                <!-- Jendela Chat -->
        <div id="chatbot-window">
            <div class="chatbot-header">
                <h3>Fin AI</h3>
                <button class="close-chatbot" id="chatbot-close">&times;</button>
            </div>
            
            <!-- Area Pesan Native -->
            <div class="chatbot-messages" id="chatbot-messages">
                <div class="message bot">
                    Bip Bop! <img src="../shared/assets/fin-ai-icon.png" alt="Fin AI" style="height: 24px; width: auto; vertical-align: middle; margin: 0 4px;"> Halo, namaku Fin AI. Aku adalah robot cerdas yang siap menjawab pertanyaanmu tentang uang, jajan, atau menabung. Ada yang ingin kamu tanyakan hari ini? 💰✨
                </div>
            </div>
            
            <!-- Area Input Native -->
            <div class="chatbot-input-area">
                <input type="text" id="chatbot-input" placeholder="Tanya sesuatu ke Fin..." autocomplete="off">
                <button id="chatbot-send">➤</button>
            </div>
        </div>
    `;


    document.body.insertAdjacentHTML('beforeend', chatbotHTML);


    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const chatWindow = document.getElementById('chatbot-window');

    const messagesArea = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');



    let isDraggingBot = false;
    let didDragBot = false;
    let startXBot, startYBot, initialXBot, initialYBot;

    const dragStartBot = (e) => {
        if (e.target.closest('#chatbot-close')) return;

        isDraggingBot = true;
        didDragBot = false;
        const event = e.type.includes('touch') ? e.touches[0] : e;
        startXBot = event.clientX;
        startYBot = event.clientY;

        const rect = toggleBtn.getBoundingClientRect();
        initialXBot = rect.left;
        initialYBot = rect.top;

        toggleBtn.style.transition = 'none';

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


        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            didDragBot = true;
            if (e.cancelable) e.preventDefault();
        }

        if (!didDragBot) return;

        let newX = initialXBot + dx;
        let newY = initialYBot + dy;


        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        if (newX + toggleBtn.offsetWidth > window.innerWidth) newX = window.innerWidth - toggleBtn.offsetWidth;
        if (newY + toggleBtn.offsetHeight > window.innerHeight) newY = window.innerHeight - toggleBtn.offsetHeight;

        toggleBtn.style.left = newX + 'px';
        toggleBtn.style.top = newY + 'px';
        updateChatWindowPosition();
    };

    const dragEndBot = (e) => {
        if (!isDraggingBot) return;
        isDraggingBot = false;
        toggleBtn.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';


        if (didDragBot) {

        }
    };

    toggleBtn.addEventListener('mousedown', dragStartBot);
    toggleBtn.addEventListener('touchstart', dragStartBot, { passive: false });

    document.addEventListener('mousemove', dragBot, { passive: false });
    document.addEventListener('touchmove', dragBot, { passive: false });

    document.addEventListener('mouseup', dragEndBot);
    document.addEventListener('touchend', dragEndBot);


    window.addEventListener('resize', () => {
        let currentLeft = parseInt(toggleBtn.style.left, 10);
        let currentTop = parseInt(toggleBtn.style.top, 10);


        if (isNaN(currentLeft) || isNaN(currentTop)) return;

        let newX = currentLeft;
        let newY = currentTop;

        if (newX + toggleBtn.offsetWidth > window.innerWidth) newX = window.innerWidth - toggleBtn.offsetWidth;
        if (newY + toggleBtn.offsetHeight > window.innerHeight) newY = window.innerHeight - toggleBtn.offsetHeight;

        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;

        toggleBtn.style.left = newX + 'px';
        toggleBtn.style.top = newY + 'px';


        updateChatWindowPosition();
    });



    toggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        updateChatWindowPosition();
        if (chatWindow.classList.contains('active')) {

            messagesArea.scrollTop = messagesArea.scrollHeight;
        }
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });


    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;


        messageDiv.innerHTML = text.replace(/\n/g, '<br>');

        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }


    async function sendMessageToGemini(userText) {

        appendMessage(userText, 'user');


        if (typeof logActivity === 'function') {

            const shortText = userText.length > 30 ? userText.substring(0, 30) + '...' : userText;
            logActivity(`Bertanya ke Fin AI: "${shortText}"`);
        }


        inputField.value = '';
        inputField.disabled = true;
        sendBtn.disabled = true;


        const loadingId = "loading-" + Date.now();
        const loadingHtml = `<div id="${loadingId}" class="message bot" style="color: #7F8C8D; font-style: italic;">Fin sedang berpikir... ⏳</div>`;
        messagesArea.insertAdjacentHTML('beforeend', loadingHtml);
        messagesArea.scrollTop = messagesArea.scrollHeight;

        try {

            const payload = {
                message: userText,
                systemPrompt: SYSTEM_PROMPT
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });


            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) loadingEl.remove();

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const detail = errData.error || response.statusText;
                throw new Error("Error " + response.status + ": " + detail);
            }

            const data = await response.json();
            let botReply = data.reply || "Maaf, Fin sedang bingung. Coba lagi ya!";


            appendMessage(botReply, 'bot');

        } catch (error) {

            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) loadingEl.remove();

            console.error("Gemini Error:", error);


            appendMessage("Aduh! Sistem menolak kuncinya. Pesan dari Google: <b>" + error.message + "</b>", 'bot');
        } finally {

            inputField.disabled = false;
            sendBtn.disabled = false;
            inputField.focus();
        }
    }


    sendBtn.addEventListener('click', () => {
        const text = inputField.value.trim();
        if (text) {
            sendMessageToGemini(text);
        }
    });

    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = inputField.value.trim();
            if (text) {
                sendMessageToGemini(text);
            }
        }
    });

});
