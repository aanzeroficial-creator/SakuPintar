const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');
js = js.replace(/\\\\`/g, '`');
js = js.replace(/\\\\\$/g, '$');
fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', js);
console.log("Fixed the escaped backticks!");
