const fs = require('fs');
let html = fs.readFileSync('d:/New folder (3)/student/perencanaan.html', 'utf8');


const searchPattern = /<nav class="student-nav">\s*<div class="container nav-container">\s*<div class="planning-card">/g;

const fixStr = `<nav class="student-nav">
        <div class="container nav-container">
            <div class="logo">Saku Pintar</div>
            <a href="index.html" class="btn btn-home">Kembali</a>
        </div>
    </nav>

    <main class="container" style="margin-top: 40px;">
        <header class="welcome-section text-center">
            <h1>Rencana Keuanganku 📝</h1>
            <p>Ayo atur uangmu agar bisa dikelola dengan baik!</p>
        </header>

        <div class="planning-layout">
            <!-- ==========================================
                 KOLOM KIRI: Input Uang & Daftar Rencana
                 ========================================== -->
            <div class="planning-card">`;

if (searchPattern.test(html)) {
    html = html.replace(searchPattern, fixStr);
    fs.writeFileSync('d:/New folder (3)/student/perencanaan.html', html);
    console.log("Fixed perencanaan.html!");
} else {
    console.log("Could not find the exact broken string.");
}
