const fs = require('fs');
const readline = require('readline');

async function extract() {
    const fileStream = fs.createReadStream('C:\\\\Users\\\\ACER\\\\.gemini\\\\antigravity\\\\brain\\\\7e20230d-6b37-4018-8f6f-7a1233641d37\\\\.system_generated\\\\logs\\\\transcript_full.jsonl');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    let htmlContent = null;
    let maxHtmlLength = 0;
    let jsContent = null;
    
    for await (const line of rl) {
        if (line.includes('instruksi-toko')) {
            try {
                const entry = JSON.parse(line);
                if (entry.type === 'PLANNER_RESPONSE' && entry.tool_calls) {
                    for (const call of entry.tool_calls) {
                        if (call.name === 'write_to_file' && call.args && call.args.TargetFile && call.args.TargetFile.includes('instruksi-toko.html')) {
                            if (call.args.CodeContent && call.args.CodeContent.length > maxHtmlLength) {
                                htmlContent = call.args.CodeContent;
                                maxHtmlLength = call.args.CodeContent.length;
                            }
                        }
                    }
                }
            } catch (e) {}
        }
    }
    
    if (htmlContent) {
        fs.writeFileSync('d:/New folder (3)/student/instruksi-toko-v2.html', htmlContent);
        console.log("Restored instruksi-toko-v2.html! Length: " + htmlContent.length);
    }
}
extract();
