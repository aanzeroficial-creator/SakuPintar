const fs = require('fs');

let c = fs.readFileSync('d:/New folder (3)/student/js/eksplorasi.js', 'utf8');
c = c.substring(0, c.indexOf('function createParticles()'));

while(c.trim().endsWith('}') || c.trim().endsWith(';') || c.trim().endsWith(')')) {
    c = c.trim().substring(0, c.trim().length - 1);
}

c += `
        });
    }
});

function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '&#9733;';
        particle.style.position = 'fixed';
        particle.style.zIndex = '999999';
        particle.style.fontSize = (Math.random() * 25 + 10) + 'px';
        const colors = ['#FFFFFF', '#FFD700', '#FFFF00', '#00FFFF'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.color = color;
        particle.style.textShadow = \\\`0 0 10px \${color}, 0 0 20px \${color}\\\`;
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.pointerEvents = 'none';
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 200;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.animate([
            { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
            { transform: \\\`translate(\${tx}px, \${ty}px) scale(0) rotate(\${Math.random() * 360}deg)\\\`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1500,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => particle.remove();
    }
}
`;

fs.writeFileSync('d:/New folder (3)/student/js/eksplorasi.js', c);
