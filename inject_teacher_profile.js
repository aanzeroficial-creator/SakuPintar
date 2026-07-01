const fs = require('fs');

let html = fs.readFileSync('d:/New folder (3)/teacher/index.html', 'utf8');


const oldProfile = `<div class="sidebar-profile">
                  <div class="profile-avatar">dY\`c</div>
                  <div class="profile-info">
                      <h3>Aan Rifai, S.Pd.</h3>
                      <p>Guru PNS</p>
                  </div>
              </div>`;

const newProfile = `<div class="sidebar-profile" style="position: relative;">
                  <img id="sidebarAvatar" src="aset teacher/default-avatar.png" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; background: #fff;">
                  <div class="profile-info" style="flex: 1;">
                      <h3 id="sidebarName">Aan Rifai, S.Pd.</h3>
                      <p id="sidebarRole">Guru PNS</p>
                  </div>
                  <button id="btnEditProfile" title="Edit Profil" style="background: none; border: none; color: #BDC3C7; cursor: pointer; padding: 5px; position: absolute; right: 10px; top: 15px;">
                      ⚙️
                  </button>
              </div>`;

if (html.includes(oldProfile)) {
    html = html.replace(oldProfile, newProfile);
} else if (html.includes('<div class="profile-avatar">')) {
    
    html = html.replace(/<div class="sidebar-profile">[\s\S]*?<\/div>\s*<\/div>/, newProfile);
}


const modalHTML = `
    <!-- Modal Edit Profil -->
    <div id="profileModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; align-items: center; justify-content: center;">
        <div style="background: white; padding: 25px; border-radius: 15px; width: 90%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <h2 style="margin-top: 0; margin-bottom: 20px; color: #2C3E50; text-align: center;">Edit Profil Guru</h2>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <img id="previewAvatar" src="aset teacher/default-avatar.png" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #3498DB; margin-bottom: 10px;">
                <br>
                <label for="inputAvatarUpload" style="background: #3498DB; color: white; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size: 0.9rem; display: inline-block;">Pilih Foto Profil (Local)</label>
                <input type="file" id="inputAvatarUpload" accept="image/*" style="display: none;">
                <p style="font-size: 0.8rem; color: #7F8C8D; margin-top: 5px;">*Foto akan disimpan di browser Anda.</p>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #34495E;">Nama Lengkap</label>
                <input type="text" id="inputProfileName" placeholder="Contoh: Budi Santoso, S.Pd." style="width: 100%; padding: 10px; border: 1px solid #BDC3C7; border-radius: 8px; box-sizing: border-box;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #34495E;">Deskripsi / Peran</label>
                <input type="text" id="inputProfileRole" placeholder="Contoh: Wali Kelas 3A" style="width: 100%; padding: 10px; border: 1px solid #BDC3C7; border-radius: 8px; box-sizing: border-box;">
            </div>

            <div style="display: flex; gap: 10px;">
                <button id="btnCancelProfile" style="flex: 1; padding: 12px; border: none; border-radius: 8px; background: #ECF0F1; color: #7F8C8D; cursor: pointer; font-weight: bold;">Batal</button>
                <button id="btnSaveProfile" style="flex: 1; padding: 12px; border: none; border-radius: 8px; background: #2ECC71; color: white; cursor: pointer; font-weight: bold;">Simpan</button>
            </div>
        </div>
    </div>
`;

if (!html.includes('id="profileModal"')) {
    html = html.replace('<!-- Script JavaScript -->', modalHTML + '\n    <!-- Script JavaScript -->');
}

fs.writeFileSync('d:/New folder (3)/teacher/index.html', html);
console.log("HTML Injected");
