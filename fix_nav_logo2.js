const fs = require('fs');
let c = fs.readFileSync('d:/New folder (3)/student/detektor.html', 'utf8');

c = c.replace(/<div class="logo"[^>]*>.*?<\/div>/, `<div class="logo" style="font-size: 1.5rem; display: flex; align-items: center; gap: 10px;"><img src="aset student/icon-kekei.png" style="height: 30px; width: auto;"> Saku Pintar</div>`);

fs.writeFileSync('d:/New folder (3)/student/detektor.html', c);
console.log("Success");
