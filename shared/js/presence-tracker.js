

document.addEventListener('DOMContentLoaded', () => {
    
    const authData = sessionStorage.getItem('siswaAuth');
    if (!authData) return; 
    
    const siswa = JSON.parse(authData);
    
    
    const siswaId = `${siswa.kelas}_${siswa.nama}`.replace(/\s+/g, '_').toLowerCase();
    
    let pingInterval;

    
    async function sendPing() {
        if (typeof window.updatePresence === 'function') {
            await window.updatePresence(siswaId, siswa.nama, siswa.kelas, 'online');
        }
    }

    
    sendPing();

    
    pingInterval = setInterval(() => {
        
        if (document.visibilityState === 'visible') {
            sendPing();
        }
    }, 120000);

    
    window.addEventListener('beforeunload', () => {
        
        if (typeof window.updatePresence === 'function') {
            window.updatePresence(siswaId, siswa.nama, siswa.kelas, 'offline');
        }
    });
});
