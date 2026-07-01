const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');


js = js.replace(/\\n\}\);\\n/g, '');


while (js.trim().endsWith('});')) {
    js = js.trim().substring(0, js.trim().length - 3);
}
while (js.trim().endsWith('}')) {
     js = js.trim().substring(0, js.trim().length - 1);
}


js = js.trim() + '\n});\n';

fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', js);
console.log("Cleaned it for real.");
