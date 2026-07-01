const fs = require('fs');

let js = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');


if (!js.trim().endsWith('});')) {
    js = js.trim() + '\\n});\\n';
    fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', js);
    console.log("Added missing }); to the end of eksplorasi.js");
} else {
    console.log("Already ends with });");
}
