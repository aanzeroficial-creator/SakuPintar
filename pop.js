const fs = require('fs');

let lines = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8').split('\\n');


while(lines[lines.length - 1].trim() === '') {
    lines.pop();
}


console.log("Removing line:", lines.pop());

fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', lines.join('\\n'));
console.log("Done");
