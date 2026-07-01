





function formatRupiah(angka) {
    
    const num = Number(angka);
    
    if (isNaN(num)) return "Rp 0";
    
    
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0
    }).format(num);
}


function createElement(tag, className, textContent = "") {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent) el.textContent = textContent;
    return el;
}




function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    
    while (currentIndex !== 0) {
        
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }

    return array;
}


window.resizeAndCompressImage = function(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400; 
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(dataUrl);
            };
            img.onerror = error => reject(error);
        };
        reader.onerror = error => reject(error);
    });
};




const rootPath = (window.location.pathname.includes('/student/') || window.location.pathname.includes('/teacher/')) ? '../' : './';


const isPlayablePage = window.location.pathname.includes('/student/') || window.location.pathname.includes('/teacher/');


const audios = {
    
    bgm: new Audio(rootPath + (window.location.pathname.includes('kuis') ? 'backsound kuis.mp3' : 'backsound.mp3')),
    click: new Audio(rootPath + 'klik semua.mp3'),
    correct: new Audio(rootPath + 'benar.mp3'),
    wrong: new Audio(rootPath + 'salah.mp3'),
    applause: new Audio(rootPath + 'u_o8xh7gwsrj-cute_happy_victory-476376.mp3')
};


audios.bgm.loop = true; 
audios.bgm.volume = 0.3; 


if (isPlayablePage) {
    const savedBgmSrc = sessionStorage.getItem('bgm_src');
    const savedBgmTime = sessionStorage.getItem('bgm_currentTime');
    if (savedBgmSrc === audios.bgm.src && savedBgmTime) {
        audios.bgm.currentTime = parseFloat(savedBgmTime);
    }

    
    audios.bgm.addEventListener('timeupdate', () => {
        if (!audios.bgm.paused) {
            sessionStorage.setItem('bgm_currentTime', audios.bgm.currentTime);
            sessionStorage.setItem('bgm_src', audios.bgm.src);
        }
    });
}


let isMuted = localStorage.getItem('isMuted') === 'true';


let onMuteStatusChange = null;


window.setMuteStatus = function(muted) {
    isMuted = muted;
    localStorage.setItem('isMuted', isMuted);
    
    if (isMuted) {
        Object.values(audios).forEach(a => a.volume = 0);
        audios.bgm.pause();
    } else {
        
        audios.bgm.volume = 0.3;
        audios.click.volume = 0.6;
        audios.correct.volume = 1.0;
        audios.wrong.volume = 1.0;
        audios.applause.volume = 1.0;
        
        if (isPlayablePage && audios.bgm.paused) {
            audios.bgm.play().catch(err=>{});
        }
    }
    
    if (onMuteStatusChange) {
        onMuteStatusChange();
    }
};


if (isMuted) {
    audios.bgm.volume = 0;
}


function playBGM() {
    if (isPlayablePage && !isMuted && audios.bgm.paused) {
        
        audios.bgm.play().then(() => {
            console.log("BGM berhasil diputar secara otomatis.");
            
            document.body.removeEventListener('click', playBGM);
        }).catch(error => {
            console.log("Autoplay diblokir browser, butuh interaksi user dulu.");
        });
    }
}


function playClickSound() {
    if (true) { 
        
        const clickClone = audios.click.cloneNode();
        clickClone.volume = 0.6; 
        clickClone.play().catch(err => {});
    }
}


function createAudioToggleUI() {
    const btnAudio = document.createElement('button');
    btnAudio.id = 'btnToggleGlobalAudio';
    
    
    const updateButtonUI = () => {
        if (isMuted) {
            btnAudio.innerHTML = 'Musik: OFF';
            btnAudio.style.backgroundColor = '#E74C3C'; 
        } else {
            btnAudio.innerHTML = 'Musik: ON';
            btnAudio.style.backgroundColor = '#2ECC71'; 
        }
    };
    
    
    onMuteStatusChange = updateButtonUI;

    btnAudio.title = "Matikan/Nyalakan Suara";
    btnAudio.style.cssText = `
        padding: 8px 15px;
        border-radius: 20px;
        color: white;
        font-size: 0.9rem;
        font-weight: bold;
        border: none;
        cursor: pointer;
        font-family: inherit;
        transition: transform 0.1s, background-color 0.3s;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 5px;
    `;
    
    
    updateButtonUI();
    
    
    btnAudio.onmousedown = () => btnAudio.style.transform = 'translateY(4px)';
    btnAudio.onmouseup = () => btnAudio.style.transform = 'translateY(0)';
    btnAudio.onmouseleave = () => btnAudio.style.transform = 'translateY(0)';
    
    btnAudio.addEventListener('click', (e) => {
        e.stopPropagation(); 
        window.setMuteStatus(!isMuted);
    });

    const navContainer = document.querySelector('.nav-container');
    const teacherNav = document.querySelector('.top-user-actions');
    const headerRight = document.querySelector('.header-right');
    
    if (navContainer) {
        
        navContainer.prepend(btnAudio);
        btnAudio.style.marginRight = 'auto'; 
    } else if (teacherNav) {
        
        teacherNav.prepend(btnAudio);
    } else if (headerRight) {
        
        btnAudio.style.marginRight = '10px';
        headerRight.prepend(btnAudio);
    } else {
        
        btnAudio.style.position = 'absolute';
        btnAudio.style.top = '15px';
        btnAudio.style.right = '15px'; 
        btnAudio.style.zIndex = '999999';
        document.body.appendChild(btnAudio);
    }
}


function displayUserIdentity() {
    const path = window.location.pathname.toLowerCase();
    
    
    
    const isRootFolder = !path.includes('/student/') && !path.includes('/teacher/');
    if (path.includes('/teacher/') || (path.includes('index.html') && isRootFolder) || path.includes('login') || path.includes('kuis-belanja') || (path.endsWith('/') && isRootFolder)) {
        return;
    }

    let nama = "";
    let roleInfo = "";
    
    
    const siswaAuth = sessionStorage.getItem('siswaAuth');
    if (siswaAuth) {
        try {
            const data = JSON.parse(siswaAuth);
            nama = data.nama;
            roleInfo = `Kelas ${data.kelas}`;
        } catch (e) {}
    } else {
        
        const guruAuth = sessionStorage.getItem('guruAuth');
        if (guruAuth) {
            try {
                const data = JSON.parse(guruAuth);
                nama = data.nama || "Guru";
                roleInfo = "Dasbor Guru";
            } catch(e) {}
        }
    }
    
    
    if (!nama) return;

    
    const oldBadge = document.getElementById('userIdentityContainer');
    if (oldBadge) oldBadge.remove();

    const navContainer = document.querySelector('.nav-container') || document.querySelector('.header-right');
    
    if (navContainer) {
        
        const idContainer = document.createElement('div');
        idContainer.id = 'userIdentityContainer';
        idContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin-left: auto; /* Dorong ke kanan */
            margin-right: 15px; /* Spasi dengan tombol Kembali */
        `;
        
        
        const badge = document.createElement('div');
        badge.innerHTML = `Halo, <strong>${nama}</strong> (${roleInfo})`;
        badge.style.cssText = `
            background: rgba(255, 255, 255, 0.4);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.95rem;
            backdrop-filter: blur(5px);
            font-weight: 500;
        `;
        
        
        const btnLogout = document.createElement('button');
        btnLogout.innerHTML = 'Keluar';
        btnLogout.style.cssText = `
            background: #E74C3C;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: bold;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.1s;
        `;
        btnLogout.onmousedown = () => btnLogout.style.transform = 'translateY(2px)';
        btnLogout.onmouseup = () => btnLogout.style.transform = 'translateY(0)';
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem('siswaAuth');
            sessionStorage.removeItem('guruAuth');
            sessionStorage.removeItem('bgm_currentTime');
            sessionStorage.removeItem('bgm_src');
            window.location.href = rootPath + 'index.html'; 
        });
        
        idContainer.appendChild(badge);
        idContainer.appendChild(btnLogout);
        
        
        if (navContainer.lastElementChild) {
            navContainer.insertBefore(idContainer, navContainer.lastElementChild);
        } else {
            navContainer.appendChild(idContainer);
        }
    } else {
        
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    
    if (isPlayablePage) {
        createAudioToggleUI();
        
        
        playBGM();

        
        const activationEvents = ['click', 'touchstart', 'mousedown', 'keydown'];
        activationEvents.forEach(event => {
            document.body.addEventListener(event, playBGM, { once: true });
        });
    }
    
    
    displayUserIdentity();
    
    
    document.body.addEventListener('click', (e) => {
        
        const isClickable = e.target.closest('button, a, .clickable');
        if (isClickable) {
            playClickSound();
        }
    });
});




window.logActivity = async function(aktivitasText, skorTerkait = null, catatanKhusus = "") {
    
    
    const siswaAuth = sessionStorage.getItem('siswaAuth');
    
    
    if (!siswaAuth) return;
    
    const dataSiswa = JSON.parse(siswaAuth);

    
    const activityData = {
        nama: dataSiswa.nama,
        kelas: dataSiswa.kelas,
        waktu: new Date().toLocaleString('id-ID'), 
        aktivitas: aktivitasText,
        skorAkhir: skorTerkait !== null ? skorTerkait : "-",
        catatan: catatanKhusus,
        timestamp: Date.now() 
    };

    
    if (typeof recordActivityToDB === 'function') {
        try {
            await recordActivityToDB(activityData);
        } catch (err) {
            console.error("Gagal mencatat log ke Firebase:", err);
        }
    } else {
        
        console.warn("Fungsi database tak ditemukan! Disimpan secara lokal.");
        const currentLogs = JSON.parse(localStorage.getItem('offlineLogs') || '[]');
        currentLogs.push(activityData);
        localStorage.setItem('offlineLogs', JSON.stringify(currentLogs));
    }
};


   function downloadTableToCSV(filename, tableId) {
    const table = document.getElementById(tableId);
    let csv = [];
    for (let i = 0; i < table.rows.length; i++) {
        let row = [], cols = table.rows[i].querySelectorAll("td, th");
        for (let j = 0; j < cols.length; j++) 
            
            row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
        csv.push(row.join(","));		
    }
    const csvFile = new Blob([csv.join("\n")], {type: "text/csv"});
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}



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
            
            if (typeof playClickSound === 'function') {
                playClickSound();
            }
        };
    };
})();


(function() {
    
    const style = document.createElement('style');
    style.innerHTML = `
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
    `;
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
                confirmButtonColor: '#E67E22', 
                background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)', 
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
            
            if (typeof playClickSound === 'function') {
                playClickSound();
            }
        };
    };
})();
