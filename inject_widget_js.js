const fs = require('fs');
let js = fs.readFileSync('d:/New folder (3)/student/js/perencanaan.js', 'utf8');

const widgetLogic = `
    // ==========================================
    // LOGIKA WIDGET MENGAMBANG (DRAGGABLE)
    // ==========================================
    const floatingWidget = document.getElementById('floatingWidget');
    const floatingSisaUangVal = document.getElementById('floatingSisaUangVal');

    if (floatingWidget) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        const dragHandle = floatingWidget.querySelector('.drag-handle');

        // Fungsi Drag untuk Mouse dan Touch
        const dragStart = (e) => {
            isDragging = true;
            const event = e.type.includes('touch') ? e.touches[0] : e;
            startX = event.clientX;
            startY = event.clientY;
            
            const rect = floatingWidget.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            // Set position ke absolut fixed relative to viewport
            floatingWidget.style.bottom = 'auto';
            floatingWidget.style.right = 'auto';
            floatingWidget.style.left = initialX + 'px';
            floatingWidget.style.top = initialY + 'px';
            floatingWidget.style.transform = 'scale(1.05)';
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Mencegah scrolling saat ditarik
            const event = e.type.includes('touch') ? e.touches[0] : e;
            
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            
            let newX = initialX + dx;
            let newY = initialY + dy;
            
            // Batasi agar tidak keluar layar
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + floatingWidget.offsetWidth > window.innerWidth) newX = window.innerWidth - floatingWidget.offsetWidth;
            if (newY + floatingWidget.offsetHeight > window.innerHeight) newY = window.innerHeight - floatingWidget.offsetHeight;

            floatingWidget.style.left = newX + 'px';
            floatingWidget.style.top = newY + 'px';
        };

        const dragEnd = () => {
            isDragging = false;
            floatingWidget.style.transform = 'scale(1)';
        };

        dragHandle.addEventListener('mousedown', dragStart);
        dragHandle.addEventListener('touchstart', dragStart, {passive: false});

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, {passive: false});

        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }
`;


const oldUpdateUI = `displaySisaUang.textContent = formatRupiah(sisaUang);`;
const newUpdateUI = `displaySisaUang.textContent = formatRupiah(sisaUang);
        
        // Update Widget Mengambang
        if (floatingSisaUangVal) {
            floatingSisaUangVal.textContent = formatRupiah(sisaUang);
            if (sisaUang < 0) {
                floatingSisaUangVal.style.color = "var(--danger)";
            } else if (sisaUang === 0) {
                floatingSisaUangVal.style.color = "#D35400";
            } else {
                floatingSisaUangVal.style.color = "var(--success)";
            }
        }`;

if (!js.includes('LOGIKA WIDGET MENGAMBANG')) {
    
    js += '\n' + widgetLogic;
    
    js = js.replace(oldUpdateUI, newUpdateUI);
    fs.writeFileSync('d:/New folder (3)/student/js/perencanaan.js', js);
    console.log("Widget JS injected");
} else {
    console.log("Already exists");
}
