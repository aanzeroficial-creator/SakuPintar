const fs = require('fs');
const readline = require('readline');

async function extractHistory() {
    const fileStream = fs.createReadStream('C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7e20230d-6b37-4018-8f6f-7a1233641d37\\.system_generated\\logs\\transcript_full.jsonl');
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
    let htmlVersions = [];
    let jsVersions = [];
    
    for await (const line of rl) {
        try {
            const entry = JSON.parse(line);
            const content = JSON.stringify(entry);
            
            
            if (content.includes('instruksi-toko.html') && content.includes('CodeContent')) {
                
                if (entry.tool_calls) {
                    for (let tc of entry.tool_calls) {
                        if (tc.name === 'write_to_file' || tc.name === 'replace_file_content') {
                            if (tc.args.TargetFile && tc.args.TargetFile.includes('instruksi-toko.html')) {
                                htmlVersions.push(tc.args.CodeContent || tc.args.ReplacementContent);
                            }
                        }
                    }
                }
            }
            if (content.includes('instruksi-toko.js') && content.includes('CodeContent')) {
                if (entry.tool_calls) {
                    for (let tc of entry.tool_calls) {
                        if (tc.name === 'write_to_file' || tc.name === 'replace_file_content') {
                            if (tc.args.TargetFile && tc.args.TargetFile.includes('instruksi-toko.js')) {
                                jsVersions.push(tc.args.CodeContent || tc.args.ReplacementContent);
                            }
                        }
                    }
                }
            }
        } catch (e) {}
    }
    
    
    
    
    console.log("Found HTML versions:", htmlVersions.length);
    console.log("Found JS versions:", jsVersions.length);
    
    if (htmlVersions.length > 0) fs.writeFileSync('d:/New folder (3)/history_html.txt', htmlVersions.join('\\n\\n---NEXT---\\n\\n'));
    if (jsVersions.length > 0) fs.writeFileSync('d:/New folder (3)/history_js.txt', jsVersions.join('\\n\\n---NEXT---\\n\\n'));
}
extractHistory();
