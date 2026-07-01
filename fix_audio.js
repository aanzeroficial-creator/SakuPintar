const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/shared/js/utils.js', 'utf8');


js = js.replace(
    /if \(isMuted\) {\s*Object.values\(audios\).forEach\(a => a.volume = 0\);\s*}/,
    `if (isMuted) {\n    audios.bgm.volume = 0;\n}`
);


js = js.replace(
    /function playClickSound\(\) {\s*if \(!isMuted\) {/,
    `function playClickSound() {\n    if (true) { // Selalu mainkan SFX`
);


js = js.replace(
    /if \(isMuted\) {\s*Object.values\(audios\).forEach\(a => a.volume = 0\);\s*audios.bgm.pause\(\);\s*} else {\s*\/\/ Kembalikan ke volume standar\s*audios.bgm.volume = 0.3;\s*audios.click.volume = 0.6;\s*audios.correct.volume = 1.0;\s*audios.wrong.volume = 1.0;\s*audios.applause.volume = 1.0;\s*audios.bgm.play\(\).catch\(\(\) => {}\);\s*}/,
    `if (isMuted) {
            audios.bgm.pause();
            audios.bgm.volume = 0;
        } else {
            audios.bgm.volume = 0.3;
            audios.bgm.play().catch(() => {});
        }`
);

fs.writeFileSync('d:/New folder (3)/shared/js/utils.js', js);
console.log("Success");
