const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/shared/js/utils.js', 'utf8');


const sweetAlertLogic = `/* ========================================================
   KID-FRIENDLY ALERTS (SWEETALERT2 OVERRIDE)
   Mengganti alert() bawaan browser agar lebih menarik untuk SD
   ======================================================== */
(function() {
    // Tambahkan custom CSS untuk SweetAlert agar lebih ceria
    const style = document.createElement('style');
    style.innerHTML = \`
        .kid-swal-popup {
            border: 6px solid #FF9F43 !important;
            border-radius: 30px !important;
            box-shadow: 0 15px 30px rgba(0,0,0,0.2) !important;
        }
        .kid-swal-title {
            color: #2E86C1 !important;
            font-size: 2rem !important;
            font-weight: 800 !important;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 2px 2px 0px #FFF, 4px 4px 0px rgba(0,0,0,0.1);
        }
        .kid-swal-html-container {
            color: #34495E !important;
            font-size: 1.3rem !important;
            font-weight: 600 !important;
            margin-top: 10px !important;
        }
        .kid-swal-confirm {
            font-size: 1.4rem !important;
            padding: 12px 30px !important;
            border-radius: 50px !important;
            border: 3px solid white !important;
            box-shadow: 0 6px 0 #D35400 !important;
            transition: all 0.2s !important;
            text-transform: uppercase;
            font-weight: 800 !important;
        }
        .kid-swal-confirm:active {
            transform: translateY(6px) !important;
            box-shadow: 0 0 0 #D35400 !important;
        }
    \`;
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(script);

    script.onload = () => {
        window.alert = function(message) {
            Swal.fire({
                title: 'Info Penting!',
                text: message,
                imageUrl: rootPath + 'student/aset student/icon-kekei.png',
                imageWidth: 120,
                imageHeight: 'auto',
                imageAlt: 'Robot Detektif',
                confirmButtonText: 'SIAP LAKSANAKAN!',
                confirmButtonColor: '#E67E22', // Orange ceria
                background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)', // Gradient biru muda
                backdrop: 'rgba(44, 62, 80, 0.7)',
                customClass: {
                    popup: 'kid-swal-popup',
                    title: 'kid-swal-title',
                    htmlContainer: 'kid-swal-html-container',
                    confirmButton: 'kid-swal-confirm'
                },
                showClass: {
                    popup: 'animate__animated animate__zoomIn animate__faster'
                },
                hideClass: {
                    popup: 'animate__animated animate__zoomOut animate__faster'
                }
            });
            // Play sound
            if (typeof playClickSound === 'function') {
                playClickSound();
            }
        };
    };
})();
`;


const startIndex = js.indexOf("/* ========================================================\r\n   KID-FRIENDLY ALERTS");
if (startIndex !== -1) {
    js = js.substring(0, startIndex);
}

fs.writeFileSync('d:/New folder (3)/shared/js/utils.js', js + '\n' + sweetAlertLogic);
console.log("Updated SweetAlert logic applied!");
