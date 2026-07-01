const fs = require('fs');

const fullHTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <script>
if (!sessionStorage.getItem('siswaAuth')) window.location.replace('../login-siswa.html');
</script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Eksplorasi Misi | Saku Pintar</title>
    <link rel="stylesheet" href="../shared/css/global.css">
    <style>
        /* Desain UI Gelap ala Game Misteri untuk Siswa */
        body {
            background-color: #1A252F !important;
            color: #ECF0F1;
            font-family: 'League Spartan', sans-serif;
            margin: 0; padding: 0;
            overflow-x: hidden;
            width: 100vw;
            /* Pastikan bisa di-scroll secara default */
            overflow-y: auto;
        }
        .student-nav {
            background: linear-gradient(135deg, #2C3E50 0%, #34495E 100%) !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
            border-bottom: 2px solid #F1C40F;
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        .student-nav .logo {
            color: #F1C40F !important;
            text-shadow: 0 0 10px rgba(241, 196, 15, 0.5) !important;
            letter-spacing: 2px;
        }

        /* Card Style */
        .quiz-card {
            background: rgba(44, 62, 80, 0.8) !important;
            backdrop-filter: blur(10px);
            border: 2px solid #3498DB !important;
            border-radius: 20px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(52, 152, 219, 0.2) !important;
            padding: 25px;
            margin-bottom: 30px;
            animation: floatIn 0.8s ease-out;
        }

        @keyframes floatIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .quiz-card h2 {
            color: #3498DB !important;
            text-shadow: 0 0 15px rgba(52, 152, 219, 0.6) !important;
            font-size: 2.2rem !important;
            margin-top: 0;
            border-bottom: 2px dashed #3498DB;
            padding-bottom: 10px;
            text-align: center;
        }

        /* Gacha Area */
        #pilihKelompokArea {
            background: rgba(0, 0, 0, 0.3);
            padding: 20px;
            border-radius: 15px;
            border: 1px solid #7F8C8D;
            text-align: center;
        }
        #pilihanKelompok {
            background: #2C3E50;
            color: #F1C40F;
            border: 2px solid #F1C40F;
            border-radius: 10px;
            padding: 12px;
            font-weight: bold;
            outline: none;
            transition: all 0.3s;
        }
        #pilihanKelompok:focus {
            box-shadow: 0 0 15px rgba(241, 196, 15, 0.5);
        }
        
        #btnAcakCerita {
            background: linear-gradient(to bottom, #9B59B6, #8E44AD) !important;
            border: none !important;
            box-shadow: 0 6px 0 #732D91 !important;
            text-transform: uppercase;
            font-weight: 900 !important;
            letter-spacing: 1px;
            transition: all 0.2s ease;
        }
        #btnAcakCerita:active {
            transform: translateY(6px);
            box-shadow: none !important;
        }

        /* Animasi Transisi lambat untuk hasil gacha */
        .stumble-transition {
            animation: revealSlow 2s cubic-bezier(0.1, 0.8, 0.1, 1) forwards;
        }

        @keyframes revealSlow {
            0% { opacity: 0; transform: scale(0.8) translateY(50px); filter: blur(10px); }
            50% { opacity: 0.5; filter: blur(5px); }
            100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }

        /* Hasil Cerita Box */
        #hasilCeritaArea > div:nth-child(1) {
            background: rgba(241, 196, 15, 0.1) !important;
            border-left: 5px solid #F1C40F !important;
            border-top: 1px solid rgba(241, 196, 15, 0.3) !important;
            border-right: 1px solid rgba(241, 196, 15, 0.3) !important;
            border-bottom: 1px solid rgba(241, 196, 15, 0.3) !important;
            box-shadow: inset 0 0 20px rgba(241, 196, 15, 0.1);
        }
        #hasilCeritaArea h3 { text-shadow: none; font-size: 1.5rem; }
        #teksCerita { color: #FFFDE7 !important; font-size: 1.2rem !important; }

        /* Aturan Box */
        #hasilCeritaArea > div:nth-child(2) {
            background: rgba(255, 0, 204, 0.1) !important;
            border-left: 5px solid #ff00cc !important;
            border-top: 1px solid rgba(255, 0, 204, 0.3) !important;
            border-right: 1px solid rgba(255, 0, 204, 0.3) !important;
            border-bottom: 1px solid rgba(255, 0, 204, 0.3) !important;
            box-shadow: inset 0 0 20px rgba(255, 0, 204, 0.1);
        }
        #hasilCeritaArea > div:nth-child(2) h3 {
            color: #ff00cc !important;
            text-shadow: 0 0 5px rgba(255, 0, 204, 0.5);
        }
        #teksAturan { color: #FCE4EC !important; font-size: 1.1rem !important; }

        /* Uang Saku Box */
        #hasilCeritaArea > div:nth-child(1) > div:last-child {
            background: rgba(0, 0, 0, 0.6) !important;
            border: 1px solid #00FFFF !important;
        }
        #hasilCeritaArea > div:nth-child(1) > div:last-child span:first-child { color: #00FFFF !important; }
        #infoUangSakuMisi { color: #00FF00 !important; text-shadow: 0 0 10px #00FF00 !important; font-size: 1.8rem !important; letter-spacing: 2px;}

        /* Go Shopping Button */
        #hasilCeritaArea a.btn-student {
            background: linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%) !important;
            color: #000 !important;
            font-weight: 900 !important;
            text-transform: uppercase;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.5) !important;
            border: none !important;
            transition: all 0.3s ease;
        }
        #hasilCeritaArea a.btn-student:hover {
            transform: scale(1.05);
            box-shadow: 0 0 25px rgba(0, 255, 0, 0.8) !important;
        }
        
        .form-control {
            background: rgba(0, 0, 0, 0.5) !important;
            color: #00FFFF !important;
            border: 2px solid #00FFFF !important;
        }
        .form-control option { background: #141E30; color: #fff; }

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

    </style>
</head>
<body>
    <!-- Overlay Wajib Landscape -->
    <div id="landscape-warning">
        <div class="phone-icon">📱</div>
        <h2 style="margin-bottom: 15px;">Putar Layar HP Kamu!</h2>
        <p style="font-size: 1.1rem; line-height: 1.5;">Misi Eksplorasi ini didesain khusus untuk tampilan mendatar (Landscape) agar lebih seru dan jelas.</p>
        <button id="btnForceLandscape" style="display: inline-block; padding: 15px 30px; font-size: 1.2rem; background: #8E44AD; color: white; border: none; border-radius: 30px; margin-top: 20px; cursor: pointer; box-shadow: 0 5px 0 #732D91; font-weight: bold;">Putar Layar (Layar Penuh)</button>
    </div>

    <nav class="student-nav">
        <div class="container nav-container">
            <div class="logo">Saku Pintar 🎓</div>
            <a href="index.html" class="btn btn-home">Kembali</a>
        </div>
    </nav>
    <main class="container" style="margin-top: 40px; margin-bottom: 50px;">

        <!-- SEKSI 1: CERITA & ATURAN -->
        <section id="sectionCerita" class="quiz-card" style="display: block;">
            <h2>Misi Misteri Kelompok!</h2>
            
            <div id="pilihKelompokArea" style="margin-bottom: 20px;">
                <label style="display:block; font-weight:bold; margin-bottom:10px; text-align:left;">Kamu dari Kelompok Berapa?</label>
                <select id="pilihanKelompok" class="form-control" style="font-size:1.1rem; margin-bottom:15px; width:100%;">
                    <option value="">-- Pilih Kelompokmu --</option>
                    <!-- Options akan diisi via JS -->
                </select>

                <!-- Kontainer Animasi Roulette Ala Stumble Guys -->
                <div id="rouletteContainer" style="display: none; position: relative; width: 100%; max-width: 100%; box-sizing: border-box; height: 140px; overflow: hidden; background: #1A252F; border-radius: 15px; margin-bottom: 20px; border: 4px solid #F1C40F; box-shadow: inset 0 0 20px rgba(0,0,0,0.8); transform: translateZ(0); -webkit-transform: translateZ(0); -webkit-mask-image: -webkit-radial-gradient(white, black);">
                    <!-- Panah Penunjuk -->
                    <div style="position: absolute; top: -2px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-top: 25px solid #E74C3C; z-index: 10; filter: drop-shadow(0 3px 3px rgba(0,0,0,0.5));"></div>
                    
                    <!-- Pita yang akan digeser -->
                    <div id="rouletteTrack" style="display: flex; height: 100%; align-items: center; width: max-content; transition: transform 4.5s cubic-bezier(0.1, 0.8, 0.1, 1); transform: translateX(0);">
                        <!-- Kartu akan diisi via JS -->
                    </div>
                    
                    <!-- Area Fokus Tengah -->
                    <div style="position: absolute; top: 0; bottom: 0; left: 50%; width: 100px; transform: translateX(-50%); background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.1)); border-left: 3px solid rgba(241,196,15,0.6); border-right: 3px solid rgba(241,196,15,0.6); pointer-events: none; z-index: 5;"></div>
                </div>

                <button id="btnAcakCerita" class="btn btn-student" style="width: 100%; font-size:1.2rem; background:#8E44AD; border-color:#732D91;">Acak & Buka Misi Misteri!</button>
                <p id="infoGacha" style="color:#777; font-size:0.9rem; margin-top:10px;">Setiap kelompok akan mendapatkan kasus yang berbeda-beda secara acak.</p>
            </div>

            <div id="hasilCeritaArea" style="display: none;">
                <div style="background: #FFF9C4; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 5px solid #F1C40F; text-align: left;">
                    <h3 style="margin-top:0; color:#D4AC0D;">Cerita Kasus Kelompokmu:</h3>
                    <div id="fotoCeritaArea" style="margin-bottom: 15px; display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px;"></div>
                    <p id="teksCerita" style="font-size: 1.1rem; line-height: 1.6; color:#333;">Memuat cerita...</p>
                    <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.7); border-radius: 8px;">
                        <span style="font-size:1.1rem; font-weight:bold; color:#2C3E50;">Modal Uang Saku:</span>
                        <span id="infoUangSakuMisi" style="font-size:1.3rem; font-weight:900; color:#E67E22; display:block; margin-top:5px;">Rp ...</span>
                    </div>
                </div>
                
                <div style="background: #E8F8F5; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 5px solid #1ABC9C; text-align: left;">
                    <h3 style="margin-top:0; color:#117A65;">Aturan Main:</h3>
                    <p id="teksAturan" style="font-size: 1.1rem; line-height: 1.6; white-space: pre-wrap; color:#333;">Memuat aturan...</p>
                </div>

                <a href="instruksi-toko.html" class="btn btn-student" style="width: 100%; margin-top:10px; display:inline-block; text-decoration:none; background:#27AE60;">Ayo Pergi Berbelanja!</a>
            </div>
        </section>

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

    <!-- Memuat Firebase SDK (Compat Version untuk mendukung file://) -->
    <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
    
    <script src="../shared/js/firebase-db.js" defer></script>
    <script src="../shared/js/presence-tracker.js" defer></script>
    <script src="../shared/js/utils.js" defer></script>
    <script src="js/eksplorasi.js" defer></script>
    <script src="../shared/js/chatbot.js" defer></script>
</body>
</html>`;

fs.writeFileSync('d:/New folder (3)/student/eksplorasi.html', fullHTML);
console.log("Restored eksplorasi.html fully");
