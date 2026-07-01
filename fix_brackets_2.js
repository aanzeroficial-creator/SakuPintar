const fs = require('fs');
const { execSync } = require('child_process');

let code = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');
code = code.replace(/\\n\\}\\n\\}\\);\\n\\}\\);/, ''); 

let combos = [
    '});\\n});\\n}', 
    '});\\n}\\n});', 
    '}\\n});\\n});'
];

let fixed = false;
for (let combo of combos) {
    let testCode = code + '\\n' + combo;
    fs.writeFileSync('d:/New folder (3)/temp_test.js', testCode);
    try {
        execSync('node -c "d:/New folder (3)/temp_test.js"');
        console.log('Found fix:', JSON.stringify(combo));
        fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', testCode);
        fixed = true;
        break;
    } catch(e) {}
}

if (!fixed) console.log('Could not auto-fix');
