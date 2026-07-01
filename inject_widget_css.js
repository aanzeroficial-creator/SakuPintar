const fs = require('fs');
let css = fs.readFileSync('d:/New folder (3)/student/css/student-style.css', 'utf8');

const widgetCss = `
/* =========================================
   WIDGET MENGAMBANG (HANYA MOBILE)
   ========================================= */
.floating-widget {
    display: none; /* Disembunyikan secara default untuk layar besar */
}

@media (max-width: 768px) {
    .floating-widget {
        display: flex;
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        border: 2px solid #3498DB;
        border-radius: 30px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        align-items: center;
        padding: 5px 15px 5px 5px;
        gap: 10px;
        backdrop-filter: blur(5px);
        transition: transform 0.1s;
        /* Default position is bottom right, but draggable via JS */
    }

    .floating-widget .drag-handle {
        background: #3498DB;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        cursor: grab;
        user-select: none;
        touch-action: none; /* Mencegah layar ikut tergeser saat didrag */
    }

    .floating-widget .drag-handle:active {
        cursor: grabbing;
    }

    .floating-widget .widget-content {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
    }
}
`;

if (!css.includes('WIDGET MENGAMBANG')) {
    css += '\n' + widgetCss;
    fs.writeFileSync('d:/New folder (3)/student/css/student-style.css', css);
    console.log("Widget CSS injected");
} else {
    console.log("Already exists");
}
