const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/shared/js/chatbot.js', 'utf8');

const brokenStr = `        <!-- Jendela Chat -->
                <button id="chatbot-send">`;

const fixedStr = `        <!-- Jendela Chat -->
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
                <button id="chatbot-send">`;

if (js.includes(brokenStr)) {
    js = js.replace(brokenStr, fixedStr);
    fs.writeFileSync('d:/New folder (3)/shared/js/chatbot.js', js);
    console.log("Restored chatbot-window successfully!");
} else {
    
    const fallbackSearch = /<!-- Jendela Chat -->[\s\S]*?<button id="chatbot-send">/g;
    if (fallbackSearch.test(js)) {
        js = js.replace(fallbackSearch, fixedStr);
        fs.writeFileSync('d:/New folder (3)/shared/js/chatbot.js', js);
        console.log("Restored chatbot-window with regex!");
    } else {
        console.log("Could not find the broken string!");
    }
}
