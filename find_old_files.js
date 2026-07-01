const fs = require('fs');
const readline = require('readline');

async function processTranscript() {
    const fileStream = fs.createReadStream('C:\\Users\\ACER\\.gemini\\antigravity\\brain\\7e20230d-6b37-4018-8f6f-7a1233641d37\\.system_generated\\logs\\transcript_full.jsonl');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lastInstruksiHtml = null;
    let lastInstruksiJs = null;
    let lastEksplorasiHtml = null;
    let lastEksplorasiJs = null;

    let searchMode = null; 

    
    for await (const line of rl) {
        try {
            const entry = JSON.parse(line);
            if (entry.step_index && entry.step_index > 9600) {
                
                
            }

            
            if (entry.type === "TOOL_RESPONSE") {
                const output = entry.content || "";
                if (output.includes('instruksi-toko.html')) {
                    
                    if (output.includes('<!DOCTYPE html>')) {
                        lastInstruksiHtml = output;
                    }
                }
                if (output.includes('eksplorasi.html') && output.includes('<!DOCTYPE html>')) {
                    lastEksplorasiHtml = output;
                }
                if (output.includes('instruksi-toko.js') && output.includes('document.addEventListener')) {
                    lastInstruksiJs = output;
                }
                if (output.includes('eksplorasi.js') && output.includes('drawRandomStory')) {
                    lastEksplorasiJs = output;
                }
            }
        } catch (e) {
            
        }
    }

    
    console.log("lastInstruksiHtml size:", lastInstruksiHtml ? lastInstruksiHtml.length : 0);
    console.log("lastEksplorasiHtml size:", lastEksplorasiHtml ? lastEksplorasiHtml.length : 0);
    console.log("lastInstruksiJs size:", lastInstruksiJs ? lastInstruksiJs.length : 0);
    console.log("lastEksplorasiJs size:", lastEksplorasiJs ? lastEksplorasiJs.length : 0);

    
    if (lastInstruksiHtml) fs.writeFileSync('d:/New folder (3)/temp_instruksi.html', lastInstruksiHtml);
    if (lastEksplorasiHtml) fs.writeFileSync('d:/New folder (3)/temp_eksplorasi.html', lastEksplorasiHtml);
}

processTranscript();
