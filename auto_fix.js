const fs = require('fs');
const { execSync } = require('child_process');

let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');

function checkSyntax(code) {
    fs.writeFileSync('d:/New folder (3)/student/js/temp.js', code);
    try {
        execSync('node -c "d:/New folder (3)/student/js/temp.js"', {stdio: 'ignore'});
        return true;
    } catch (e) {
        return false;
    }
}


let lines = js.split('\\n');
while (lines.length > 0) {
    if (checkSyntax(lines.join('\\n'))) {
        console.log("Found valid syntax!");
        fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', lines.join('\\n'));
        process.exit(0);
    }
    
    
    lines.pop();
}

console.log("Could not find valid syntax by trimming.");
