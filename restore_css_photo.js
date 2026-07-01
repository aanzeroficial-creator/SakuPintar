const fs = require('fs');

const cleanCSS = `        /* Desain UI Sesuai Original */
        html, body {
            min-height: 100vh;
            margin: 0; padding: 0;
            overflow-x: hidden;
            background-color: #85C1E9 !important;
            background-image: url('aset student/9.png'); /* Menggunakan gambar kartun sebagai background */
            background-size: cover;
            background-position: center bottom;
            background-attachment: fixed;
            background-repeat: no-repeat;
            font-family: 'League Spartan', sans-serif;
            color: #ECF0F1;
        }

        /* Peringatan Wajib Landscape */
        #landscape-warning {
            display: none !important;
            position: fixed !important;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #2C3E50;
            color: white;
            z-index: 99999;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
        }
        #landscape-warning .phone-icon { font-size: 5rem; margin-bottom: 20px; animation: rotatePhone 2s infinite ease-in-out; }
        @keyframes rotatePhone { 0% { transform: rotate(0deg); } 50% { transform: rotate(-90deg); } 100% { transform: rotate(-90deg); } }
        @media screen and (max-width: 768px) and (orientation: portrait) { #landscape-warning { display: flex !important; } }

        .student-nav {
            background: rgba(26, 37, 47, 0.8) !important;
            backdrop-filter: blur(5px);
            border-bottom: 2px solid #00FFFF;
            position: sticky;
            top: 0;
            z-index: 1000;
            padding: 10px 0;
        }
        .student-nav .logo {
            color: #00FFFF !important;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5) !important;
            letter-spacing: 2px;
            font-size: 1.8rem;
            font-weight: bold;
        }
        .student-nav .btn-home {
            background: transparent;
            color: #00FFFF;
            border: 1px solid #00FFFF;
            padding: 5px 15px;
            border-radius: 5px;
            text-decoration: none;
            transition: all 0.3s;
        }

        /* Card Style */
        .quiz-card {
            background: rgba(26, 37, 47, 0.85) !important;
            backdrop-filter: blur(10px);
            border: 2px solid #00FFFF !important;
            border-radius: 20px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(0, 255, 255, 0.2) !important;
            padding: 30px;
            margin-top: 50px;
            margin-bottom: 50px;
            animation: floatIn 0.8s ease-out;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        @keyframes floatIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .quiz-card h2 {
            color: #00FFFF !important;
            text-shadow: 0 0 15px rgba(0, 255, 255, 0.6) !important;
            font-size: 2.2rem !important;
            margin-top: 0;
            margin-bottom: 20px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Gacha Area */
        #pilihKelompokArea label {
            color: #00FFFF;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 1.1rem;
        }
        #pilihanKelompok {
            background: #1A252F;
            color: #00FFFF;
            border: 2px solid #00FFFF;
            border-radius: 10px;
            padding: 15px;
            font-weight: bold;
            outline: none;
            transition: all 0.3s;
            appearance: none;
            cursor: pointer;
        }
        #pilihanKelompok:focus { box-shadow: 0 0 15px rgba(0, 255, 255, 0.5); }
        
        #btnAcakCerita {
            background: linear-gradient(to right, #FF7E5F, #FEB47B) !important; /* Warna sesuai foto: gradasi pink-orange */
            background: linear-gradient(to right, #DA22FF, #9733EE) !important; /* Atau ungu ke pink */
            color: white !important;
            border: none !important;
            border-radius: 10px !important;
            padding: 15px;
            box-shadow: 0 6px 0 #8E44AD !important;
            text-transform: uppercase;
            font-weight: 900 !important;
            letter-spacing: 2px;
            transition: all 0.2s ease;
            margin-top: 15px;
        }
        #btnAcakCerita:active { transform: translateY(6px); box-shadow: none !important; }

        /* Animasi Transisi lambat untuk hasil gacha */
        .stumble-transition { animation: revealSlow 2s cubic-bezier(0.1, 0.8, 0.1, 1) forwards; }
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
        #hasilCeritaArea > div:nth-child(2) h3 { color: #ff00cc !important; text-shadow: 0 0 5px rgba(255, 0, 204, 0.5); }
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
            padding: 15px;
            border-radius: 10px;
        }
        #hasilCeritaArea a.btn-student:hover {
            transform: scale(1.05);
            box-shadow: 0 0 25px rgba(0, 255, 0, 0.8) !important;
        }
        
        .form-control option { background: #141E30; color: #fff; }`;

let html = fs.readFileSync('d:/New folder (3)/student/eksplorasi.html', 'utf8');


html = html.replace(/<style>[\s\S]*?<\/style>/, '<style>\\n' + cleanCSS + '\\n    </style>');

fs.writeFileSync('d:/New folder (3)/student/eksplorasi.html', html);
console.log("CSS of eksplorasi.html has been completely restored to match the photo.");
