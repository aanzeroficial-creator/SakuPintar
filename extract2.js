const fs = require('fs');
const readline = require('readline');

async function extract() {
    const fileStream = fs.createReadStream('C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7e20230d-6b37-4018-8f6f-7a1233641d37\\.system_generated\\logs\\transcript_full.jsonl');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    let outputs = [];
    
    for await (const line of rl) {
        if (line.includes('eksplorasi.html') && line.includes('TOOL_RESPONSE')) {
            try {
                const entry = JSON.parse(line);
                outputs.push(entry.content);
            } catch (e) {}
        }
    }
    
    fs.writeFileSync('d:/New folder (3)/eksplorasi_reads.txt', outputs.join('\\n\\n---NEXT---\\n\\n'));
}
extract();
