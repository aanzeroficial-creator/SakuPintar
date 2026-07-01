const fs = require('fs');
const readline = require('readline');

async function extract() {
    const fileStream = fs.createReadStream('C:\\\\Users\\\\ACER\\\\.gemini\\\\antigravity\\\\brain\\\\7e20230d-6b37-4018-8f6f-7a1233641d37\\\\.system_generated\\\\logs\\\\transcript_full.jsonl');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    let lastFullWrite = null;
    
    for await (const line of rl) {
        if (line.includes('eksplorasi.js') && line.includes('write_to_file')) {
            try {
                const entry = JSON.parse(line);
                if (entry.type === 'PLANNER_RESPONSE' && entry.tool_calls) {
                    for (const call of entry.tool_calls) {
                        if (call.name === 'write_to_file' && call.args && call.args.TargetFile && call.args.TargetFile.includes('eksplorasi.js')) {
                            if (call.args.CodeContent && call.args.CodeContent.length > 1000) {
                                lastFullWrite = call.args.CodeContent;
                            }
                        }
                    }
                }
            } catch (e) {}
        }
    }
    
    if (lastFullWrite) {
        fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', lastFullWrite);
        console.log("Restored eksplorasi.js from write_to_file! Length: " + lastFullWrite.length);
    } else {
        console.log("Could not find full write_to_file for eksplorasi.js");
    }
}
extract();
