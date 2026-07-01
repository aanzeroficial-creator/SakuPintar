const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/shared/js/utils.js', 'utf8');

const sweetAlertLogic = `
/* ========================================================
   KID-FRIENDLY ALERTS (SWEETALERT2 OVERRIDE)
   Mengganti alert() bawaan browser agar lebih menarik untuk SD
   ======================================================== */
(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(script);

    script.onload = () => {
        window.alert = function(message) {
            Swal.fire({
                title: 'Halo!',
                text: message,
                imageUrl: rootPath + 'student/aset student/icon-kekei.png',
                imageWidth: 80,
                imageHeight: 'auto',
                imageAlt: 'Robot',
                confirmButtonText: 'Siap! 👍',
                confirmButtonColor: '#F1C40F',
                background: '#FFFFFF',
                color: '#2C3E50',
                backdrop: 'rgba(52, 152, 219, 0.4)',
                customClass: {
                    popup: 'rounded-20px shadow-lg border-blue'
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

if (!js.includes('KID-FRIENDLY ALERTS')) {
    fs.writeFileSync('d:/New folder (3)/shared/js/utils.js', js + '\n' + sweetAlertLogic);
    console.log("SweetAlert2 override injected into utils.js!");
} else {
    console.log("Already exists.");
}
