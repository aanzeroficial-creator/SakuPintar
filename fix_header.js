const fs = require('fs');
let c = fs.readFileSync('d:/New folder (3)/student/detektor.html', 'utf8');

c = c.replace(/<h1[^>]*>.*?Mesin Detektor Kekei<\/h1>/, `<h1 style="font-family: 'Fredoka One', cursive; color: #2C3E50; font-size: 2.5rem; text-shadow: 2px 2px 0px white; display: flex; align-items: center; justify-content: center; gap: 15px;">
    <img src="aset student/icon-kekei.png" alt="Robot Kekei" style="height: 60px; width: auto; object-fit: contain;">
    Detektor Kekei
</h1>`);

fs.writeFileSync('d:/New folder (3)/student/detektor.html', c);
console.log("Success");
