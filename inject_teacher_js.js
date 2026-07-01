const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/teacher/js/teacher-main.js', 'utf8');

const profileLogic = `
// ==========================================
// FITUR EDIT PROFIL GURU (DISIMPAN LOKAL)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnEditProfile = document.getElementById('btnEditProfile');
    const profileModal = document.getElementById('profileModal');
    const btnCancelProfile = document.getElementById('btnCancelProfile');
    const btnSaveProfile = document.getElementById('btnSaveProfile');
    const inputAvatarUpload = document.getElementById('inputAvatarUpload');
    const previewAvatar = document.getElementById('previewAvatar');
    
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    const sidebarName = document.getElementById('sidebarName');
    const sidebarRole = document.getElementById('sidebarRole');
    
    const inputProfileName = document.getElementById('inputProfileName');
    const inputProfileRole = document.getElementById('inputProfileRole');

    // Load data profil dari LocalStorage
    function loadProfile() {
        const savedProfile = localStorage.getItem('guruCustomProfile');
        if (savedProfile) {
            const data = JSON.parse(savedProfile);
            if (data.name) sidebarName.textContent = data.name;
            if (data.role) sidebarRole.textContent = data.role;
            if (data.avatar) sidebarAvatar.src = data.avatar;
        }
    }

    // Panggil saat awal dimuat
    loadProfile();

    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', () => {
            // Isi input dengan nilai saat ini
            inputProfileName.value = sidebarName.textContent;
            inputProfileRole.value = sidebarRole.textContent;
            previewAvatar.src = sidebarAvatar.src;
            
            profileModal.style.display = 'flex';
        });
    }

    if (btnCancelProfile) {
        btnCancelProfile.addEventListener('click', () => {
            profileModal.style.display = 'none';
        });
    }

    // Upload Foto -> Base64
    if (inputAvatarUpload) {
        inputAvatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    previewAvatar.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnSaveProfile) {
        btnSaveProfile.addEventListener('click', () => {
            const newName = inputProfileName.value.trim();
            const newRole = inputProfileRole.value.trim();
            const newAvatar = previewAvatar.src; // ini sudah dalam base64 jika upload, atau url lama

            if (!newName) {
                alert('Nama tidak boleh kosong!');
                return;
            }

            const profileData = {
                name: newName,
                role: newRole,
                avatar: newAvatar
            };

            // Simpan ke localStorage
            localStorage.setItem('guruCustomProfile', JSON.stringify(profileData));

            // Terapkan ke UI
            sidebarName.textContent = newName;
            sidebarRole.textContent = newRole;
            sidebarAvatar.src = newAvatar;

            profileModal.style.display = 'none';
            alert('Profil berhasil diperbarui!');
        });
    }
});
`;

if (!js.includes('FITUR EDIT PROFIL GURU')) {
    js = js + '\n' + profileLogic;
    fs.writeFileSync('d:/New folder (3)/teacher/js/teacher-main.js', js);
    console.log("JS Logic Appended");
}
