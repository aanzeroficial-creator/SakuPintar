const fs = require('fs');
let c = fs.readFileSync('d:/New folder (3)/student/detektor.html', 'utf8');

const targetRegex = /<h1([^>]*)>\s*<img src="aset student\/icon-kekei.png"([^>]*)>\s*Detektor Kekei\s*<\/h1>/;
c = c.replace(targetRegex, `<h1$1>\n    Detektor Kekei\n    <img src="aset student/icon-kekei.png"$2>\n</h1>`);

fs.writeFileSync('d:/New folder (3)/student/detektor.html', c);
console.log("Success");
