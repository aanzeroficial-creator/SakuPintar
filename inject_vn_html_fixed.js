const fs = require('fs');
let html = fs.readFileSync('d:/New folder (3)/student/eksplorasi.html', 'utf8');

const vnCSS = `
        /* --- VISUAL NOVEL UI --- */
        #vn-container {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 10000;
            background-color: black;
            user-select: none;
            overflow: hidden;
        }
        #vn-bg {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            transition: background-image 1s ease-in-out;
            z-index: 1;
        }
        .vn-overlay {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.5); 
            z-index: 2;
        }
        #vn-scene {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 3;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        }
        #vn-fairy {
            position: absolute;
            bottom: -50px;
            left: 5%;
            height: 80%;
            transition: all 1s ease-in-out;
            animation: floatFairy 3s ease-in-out infinite;
            opacity: 0;
            transform: translateY(50px);
        }
        #vn-fairy.show {
            opacity: 1;
            transform: translateY(0);
        }
        #vn-fairy img {
            height: 100%;
            max-height: 500px;
            object-fit: contain;
        }
        #vn-bubble {
            background: #ffffff;
            border: 5px solid #FF9F43;
            border-radius: 30px;
            padding: 30px;
            width: 50%;
            max-width: 600px;
            position: absolute;
            left: 40%;
            top: 50%;
            transform: translateY(-50%) scale(0.8);
            box-shadow: 0 15px 30px rgba(0,0,0,0.3);
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #vn-bubble.show {
            opacity: 1;
            transform: translateY(-50%) scale(1);
            pointer-events: auto;
        }
        #vn-bubble::before {
            content: ''; position: absolute; top: 50%; left: -25px; transform: translateY(-50%);
            border-width: 20px 30px 20px 0; border-style: solid; border-color: transparent #FF9F43 transparent transparent;
        }
        #vn-bubble::after {
            content: ''; position: absolute; top: 50%; left: -18px; transform: translateY(-50%);
            border-width: 15px 23px 15px 0; border-style: solid; border-color: transparent #ffffff transparent transparent;
        }
        #vn-speaker {
            display: inline-block; background: #FF9F43; color: white; padding: 5px 20px;
            border-radius: 20px; font-size: 1.2rem; font-weight: 800; margin-bottom: 15px;
            margin-top: -50px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            text-transform: uppercase;
        }
        #vn-text {
            font-size: 1.5rem; line-height: 1.6; color: #2C3E50; margin: 0; min-height: 100px; font-weight: 600;
        }
        #vn-hint {
            text-align: right; font-size: 1rem; color: #7F8C8D; margin-top: 15px; animation: blink 1.5s infinite; font-weight: bold;
        }
        #vn-click-layer {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 10; cursor: pointer;
        }
        .vn-btn-mulai {
            display: block; margin: 20px auto 0 auto; text-align: center; padding: 15px 30px;
            background: #27AE60; color: white; text-decoration: none; font-size: 1.4rem;
            font-weight: bold; border-radius: 30px; border: none; cursor: pointer;
            box-shadow: 0 6px 0 #1E8449; transition: all 0.2s; animation: pulse 2s infinite;
            width: max-content; pointer-events: auto;
        }
        .vn-btn-mulai:active { transform: translateY(6px); box-shadow: none; }
        @media screen and (max-width: 800px) {
            #vn-bubble { width: 60%; left: 35%; padding: 20px; }
            #vn-text { font-size: 1.2rem; }
            #vn-fairy { left: 0; }
        }
`;

const vnHTML = `
    <!-- VISUAL NOVEL CONTAINER (Ditampilkan setelah Gacha) -->
    <div id="vn-container">
        <div id="vn-bg"></div>
        <div class="vn-overlay"></div>
        <div id="vn-scene">
            <div id="vn-fairy">
                <img src="aset student/peri-pemandu.png" alt="Peri Pemandu">
            </div>
            <div id="vn-bubble">
                <div id="vn-speaker">Peri Pemandu</div>
                <p id="vn-text"></p>
                <div id="vn-hint">▶ Klik untuk lanjut</div>
                <a href="instruksi-toko.html" id="vn-btn-mulai" class="vn-btn-mulai" style="display:none;">Ayo Pergi Berbelanja! 🛒</a>
            </div>
        </div>
        <div id="vn-click-layer"></div>
    </div>
`;

let changed = false;
if (!html.includes('VISUAL NOVEL UI')) {
    html = html.replace('</style>', vnCSS + '\n    </style>');
    changed = true;
}

if (!html.includes('vn-container')) {
    html = html.replace('    <!-- Memuat Firebase SDK', vnHTML + '\n    <!-- Memuat Firebase SDK');
    changed = true;
}

if (changed) {
    fs.writeFileSync('d:/New folder (3)/student/eksplorasi.html', html);
    console.log("Visual Novel HTML and CSS injected successfully!");
} else {
    console.log("Already injected.");
}
