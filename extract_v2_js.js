const fs = require('fs');
const readline = require('readline');

async function extract() {
    const fileStream = fs.createReadStream('C:\\\\Users\\\\ACER\\\\.gemini\\\\antigravity\\\\brain\\\\7e20230d-6b37-4018-8f6f-7a1233641d37\\\\.system_generated\\\\logs\\\\transcript_full.jsonl');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    let jsContent = null;
    let maxJsLength = 0;
    
    for await (const line of rl) {
        if (line.includes('instruksi-toko.js')) {
            try {
                const entry = JSON.parse(line);
                if (entry.type === 'PLANNER_RESPONSE' && entry.tool_calls) {
                    for (const call of entry.tool_calls) {
                        if (call.name === 'write_to_file' && call.args && call.args.TargetFile && call.args.TargetFile.includes('instruksi-toko.js')) {
                            
                            if (call.args.CodeContent && call.args.CodeContent.includes('dialogue-text')) {
                                jsContent = call.args.CodeContent;
                            }
                        }
                        if (call.name === 'replace_file_content' && call.args && call.args.TargetFile && call.args.TargetFile.includes('instruksi-toko.js')) {
                            
                        }
                    }
                }
            } catch (e) {}
        }
    }
    
    if (jsContent) {
        fs.writeFileSync('d:/New folder (3)/student/js/instruksi-toko-v2.js', jsContent);
        console.log("Restored instruksi-toko-v2.js! Length: " + jsContent.length);
    } else {
        console.log("Could not find write_to_file for instruksi-toko-v2.js with dialogue-text");
    }
}
extract();
