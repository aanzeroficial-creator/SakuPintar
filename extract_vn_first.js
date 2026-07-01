const fs = require('fs');
const readline = require('readline');

async function extract() {
    const fileStream = fs.createReadStream('C:\\\\Users\\\\ACER\\\\.gemini\\\\antigravity\\\\brain\\\\7e20230d-6b37-4018-8f6f-7a1233641d37\\\\.system_generated\\\\logs\\\\transcript_full.jsonl');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    let firstHtml = null;
    let firstJs = null;
    
    for await (const line of rl) {
        if (line.includes('instruksi-toko')) {
            try {
                const entry = JSON.parse(line);
                if (entry.type === 'PLANNER_RESPONSE' && entry.tool_calls) {
                    for (const call of entry.tool_calls) {
                        if (call.name === 'write_to_file' && call.args && call.args.TargetFile) {
                            if (!firstHtml && call.args.TargetFile.includes('instruksi-toko.html') && call.args.CodeContent.includes('vn-bg')) {
                                firstHtml = call.args.CodeContent;
                            }
                            if (!firstJs && call.args.TargetFile.includes('instruksi-toko.js') && call.args.CodeContent.includes('typeWriter')) {
                                firstJs = call.args.CodeContent;
                            }
                        }
                    }
                }
            } catch (e) {}
        }
    }
    
    if (firstHtml) {
        fs.writeFileSync('d:/New folder (3)/student/instruksi-toko.html', firstHtml);
        console.log("Restored 1st instruksi-toko.html! Length: " + firstHtml.length);
    }
    if (firstJs) {
        fs.writeFileSync('d:/New folder (3)/student/js/instruksi-toko.js', firstJs);
        console.log("Restored 1st instruksi-toko.js! Length: " + firstJs.length);
    }
}
extract();
