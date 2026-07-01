const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');


js = js.replace(/\\n\}\);\\n/g, '\n});\n');

fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', js);
console.log("Fixed the literal backslash-n issue");
