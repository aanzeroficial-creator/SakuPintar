const fs = require('fs');
let html = fs.readFileSync('d:/New folder (3)/student/riwayat-perencanaan.html', 'utf8');

const searchPattern = /<h1 class="header-title" style="display:flex;[\s\S]*?<\/h1>/;

const fixStr = `<h1 class="header-title">Riwayat Rencana Belanja 📝</h1>`;

if (searchPattern.test(html)) {
    html = html.replace(searchPattern, fixStr);
    fs.writeFileSync('d:/New folder (3)/student/riwayat-perencanaan.html', html);
    console.log("Fixed riwayat-perencanaan.html!");
} else {
    console.log("Could not find the SVG header in riwayat-perencanaan.html.");
}
