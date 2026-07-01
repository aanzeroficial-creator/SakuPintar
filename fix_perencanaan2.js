const fs = require('fs');
let html = fs.readFileSync('d:/New folder (3)/student/perencanaan.html', 'utf8');

const searchStr = `    <nav class="student-nav">
        <div class="container nav-container">
            <div class="planning-card">`;

const fixStr = `    <nav class="student-nav">
        <div class="container nav-container">
            <div class="logo">Saku Pintar</div>
            <a href="index.html" class="btn btn-home">Kembali</a>
        </div>
    </nav>

    <main class="container" style="margin-top: 40px;">
        <header class="welcome-section text-center">
            <h1 style="display:flex; align-items:center; justify-content:center; gap:10px;">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #F1C40F;">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    <path d="M9 14h6"></path>
                    <path d="M9 18h6"></path>
                    <path d="M9 10h6"></path>
                </svg>
                Rencana Keuanganku
            </h1>
            <p>Ayo atur uangmu agar bisa dikelola dengan baik!</p>
        </header>

        <div class="planning-layout">
            <!-- ==========================================
                 KOLOM KIRI: Input Uang & Daftar Rencana
                 ========================================== -->
            <div class="planning-card">`;

html = html.replace(searchStr, fixStr);
fs.writeFileSync('d:/New folder (3)/student/perencanaan.html', html);
console.log("Fixed perencanaan.html!");
