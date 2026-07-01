const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');


js = js.replace('startVisualNovel(hasil);', 'startVisualNovel(teksMisi, uangSakuMisi, fotosMisi, currentStorySettings ? currentStorySettings.aturan : "Tidak ada aturan khusus.");');


const oldFunc = `function startVisualNovel(hasil) {
    const vnContainer = document.getElementById('vn-container');
    const vnBg = document.getElementById('vn-bg');
    const vnText = document.getElementById('vn-text');
    const vnClickLayer = document.getElementById('vn-click-layer');
    const vnFairy = document.getElementById('vn-fairy');
    const vnBubble = document.getElementById('vn-bubble');
    const vnHint = document.getElementById('vn-hint');
    const vnBtnMulai = document.getElementById('vn-btn-mulai');
    
    // Siapkan foto background cerita
    let bgCerita = 'url("../shared/assets/bg-supermarket.png")'; // default
    if (hasil.ceritaTerpilih && hasil.ceritaTerpilih.fotoList && hasil.ceritaTerpilih.fotoList.length > 0) {
        bgCerita = 'url("' + hasil.ceritaTerpilih.fotoList[0] + '")';
    }

    // Bangun sekuens cerita
    const storySequence = [
        {
            bg: 'url("aset student/bg-luar-toko.png")', // Gambar luar toko
            text: "Halo Kelompok " + document.getElementById('pilihanKelompok').value + "! Aku adalah Peri Pemandu. Aku membawa misi rahasia untuk kalian!"
        },
        {
            bg: bgCerita, // Ganti background sesuai foto dari guru
            text: "Ini adalah Misi Misteri kalian: " + (hasil.ceritaTerpilih ? hasil.ceritaTerpilih.teks : "Teks Cerita tidak ditemukan.")
        },
        {
            bg: bgCerita,
            text: "Aturan Mainnya: " + (hasil.aturanMain ? hasil.aturanMain : "Tidak ada aturan khusus.")
        },
        {
            bg: bgCerita,
            text: "Dan ini yang paling penting... Kalian diberikan Modal Uang Saku sebesar Rp " + (hasil.uangSakuMisi ? hasil.uangSakuMisi.toLocaleString('id-ID') : "0") + "!"
        },
        {
            bg: bgCerita,
            text: "Pecahkan misinya dan catat belanjaan kalian baik-baik ya. Semoga sukses!"
        }
    ];`;

const newFunc = `function startVisualNovel(teks, uangSaku, fotos, aturan) {
    const vnContainer = document.getElementById('vn-container');
    const vnBg = document.getElementById('vn-bg');
    const vnText = document.getElementById('vn-text');
    const vnClickLayer = document.getElementById('vn-click-layer');
    const vnFairy = document.getElementById('vn-fairy');
    const vnBubble = document.getElementById('vn-bubble');
    const vnHint = document.getElementById('vn-hint');
    const vnBtnMulai = document.getElementById('vn-btn-mulai');
    
    // Siapkan foto background cerita
    let bgCerita = 'url("../shared/assets/bg-supermarket.png")'; // default
    if (fotos && fotos.length > 0) {
        bgCerita = 'url("' + fotos[0] + '")';
    }

    // Bangun sekuens cerita
    const storySequence = [
        {
            bg: 'url("aset student/bg-luar-toko.png")', // Gambar luar toko
            text: "Halo Kelompok " + document.getElementById('pilihanKelompok').value + "! Aku adalah Peri Pemandu. Aku membawa misi rahasia untuk kalian!"
        },
        {
            bg: bgCerita, // Ganti background sesuai foto dari guru
            text: "Ini adalah Misi Misteri kalian: " + (teks ? teks : "Teks Cerita tidak ditemukan.")
        },
        {
            bg: bgCerita,
            text: "Aturan Mainnya: " + (aturan ? aturan : "Tidak ada aturan khusus.")
        },
        {
            bg: bgCerita,
            text: "Dan ini yang paling penting... Kalian diberikan Modal Uang Saku sebesar Rp " + (uangSaku ? uangSaku.toLocaleString('id-ID') : "0") + "!"
        },
        {
            bg: bgCerita,
            text: "Pecahkan misinya dan catat belanjaan kalian baik-baik ya. Semoga sukses!"
        }
    ];`;

if (js.includes(oldFunc)) {
    js = js.replace(oldFunc, newFunc);
    fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', js);
    console.log("Fixed startVisualNovel arguments.");
} else {
    console.log("Could not find the old startVisualNovel function.");
}
