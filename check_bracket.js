const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');

let stack = [];
let lines = js.split('\\n');
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    for (let j = 0; j < line.length; j++) {
        let char = line[j];
        if (char === '{' || char === '(' || char === '[') {
            stack.push({char, line: i+1});
        } else if (char === '}' || char === ')' || char === ']') {
            let last = stack.pop();
            if (!last) {
                console.log("Unexpected " + char + " at line " + (i+1));
            } else {
                let match = false;
                if (char === '}' && last.char === '{') match = true;
                if (char === ')' && last.char === '(') match = true;
                if (char === ']' && last.char === '[') match = true;
                if (!match) {
                    console.log("Mismatch at line " + (i+1) + ": expected match for " + last.char + " from line " + last.line + " but got " + char);
                }
            }
        }
    }
}

console.log("Remaining in stack:", stack.length);
if (stack.length > 0) {
    console.log(stack[stack.length - 1]);
}
