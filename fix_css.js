const fs = require('fs');

const rawCSS = `
        body {
            background-color: #1A252F !important;
            color: #ECF0F1;
            font-family: 'League Spartan', sans-serif;
            margin: 0; padding: 0;
            overflow-x: hidden;
            width: 100vw;
            overflow-y: auto;
        }

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

        #landscape-warning .phone-icon {
            font-size: 5rem;
            margin-bottom: 20px;
            animation: rotatePhone 2s infinite ease-in-out;
        }

        @keyframes rotatePhone {
            0% { transform: rotate(0deg); }
            50% { transform: rotate(-90deg); }
            100% { transform: rotate(-90deg); }
        }

        @media screen and (max-width: 768px) and (orientation: portrait) {
            #landscape-warning { display: flex !important; }
        }
`;

let html = fs.readFileSync('d:/New folder (3)/student/eksplorasi.html', 'utf8');


html = html.replace(/body\s*\{[\s\S]*?\}\s*\/\*\s*Peringatan Wajib Landscape\s*\*\/[\s\S]*?@media\s*screen\s*and\s*\(max-width:\s*768px\)\s*and\s*\(orientation:\s*portrait\)\s*\{[\s\S]*?\}\s*\}/, rawCSS.trim());

fs.writeFileSync('d:/New folder (3)/student/eksplorasi.html', html);
console.log("CSS replaced with clean version.");
