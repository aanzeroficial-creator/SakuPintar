const fs = require('fs');
let html = fs.readFileSync('d:/New folder (3)/student/perencanaan.html', 'utf8');

const widgetHtml = `
    <!-- WIDGET SISA UANG MELAYANG (MOBILE) -->
    <div id="floatingWidget" class="floating-widget">
        <div class="drag-handle" title="Geser (Drag) untuk memindahkan">⋮⋮</div>
        <div class="widget-content">
            <span style="font-size:0.75rem; color:#7F8C8D;">Sisa Uang:</span>
            <strong id="floatingSisaUangVal">Rp 0</strong>
        </div>
    </div>
`;

if (!html.includes('id="floatingWidget"')) {
    html = html.replace('</body>', widgetHtml + '\n</body>');
    fs.writeFileSync('d:/New folder (3)/student/perencanaan.html', html);
    console.log("Widget HTML injected");
} else {
    console.log("Already exists");
}
