const fs = require('fs');
const path = require('path');

function injectAuthGuard(dir, authKey, redirectUrl) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.endsWith('.html')) {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            
            const oldScriptRegex = /<script>\s*if\s*\(!sessionStorage\.getItem\('([^']+)'\)\)\s*window\.location\.replace\('[^']+'\);\s*<\/script>/gi;
            content = content.replace(oldScriptRegex, '');
            
            const scriptTag = `<script>\nif (!sessionStorage.getItem('${authKey}')) window.location.replace('${redirectUrl}');\n</script>\n`;
            
            
            if (content.includes('<head>')) {
                content = content.replace('<head>', '<head>\n    ' + scriptTag);
            } else if (content.includes('<head ')) {
                content = content.replace(/<head\s[^>]*>/i, match => match + '\n    ' + scriptTag);
            } else {
                content = scriptTag + content;
            }
            
            fs.writeFileSync(filePath, content);
            console.log("Injected guard into " + filePath);
        }
    }
}

const studentDir = path.join('d:/New folder (3)', 'student');
const teacherDir = path.join('d:/New folder (3)', 'teacher');

injectAuthGuard(studentDir, 'siswaAuth', '../login-siswa.html');
injectAuthGuard(teacherDir, 'guruAuth', '../login-guru.html');

console.log("Done injecting to all files.");
