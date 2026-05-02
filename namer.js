const segments = [
    ["Bael", "Gulis", "Mord", "Malg", "Dra", "Khar", "Xul", "Vash", "Kthun", "Zar", "Zach", "Lo", "Mast", "Aza", "Vex", "Hadr"],
    ["and", "is", "ath", "al", "og", "un", "oz", "yth", "ech", "ona", "iax", "iz"],
    ["drax", "oth", "voss", "moth", "rax", "kuhl", "gorg", "eth", "uun", "dar", "el", "lo", "iel", "akh", "is"]
];

let isSpinning = [false, false, false];

// --- RIPPLE ENGINE ---
let frame = 0;
function animateWarp() {
    const turb = document.getElementById('warpTurbulence');
    if (turb) {
        frame += 0.015;
        const freqX = 0.01 + Math.sin(frame) * 0.005;
        const freqY = 0.1 + Math.cos(frame) * 0.05;
        turb.setAttribute('baseFrequency', `${freqX} ${freqY}`);
    }
    requestAnimationFrame(animateWarp);
}
animateWarp();

function updateResult() {
    const s0 = document.getElementById('slot-1-0').innerText;
    const s1 = document.getElementById('slot-1-1').innerText;
    const s2 = document.getElementById('slot-1-2').innerText;
    
    if (s0 === "---" || s1 === "---" || s2 === "---") return;

    const name = (s0 + s1 + s2).toUpperCase();
    const display = document.getElementById('final-name');
    
    display.innerText = name;
    display.setAttribute('data-text', name); 
    drawSigil(name);
}

async function roll(index) {
    if (isSpinning[index]) return;
    const slot = document.getElementById(`slot-1-${index}`);
    isSpinning[index] = true;
    slot.classList.add('spinning');
    let cycles = 0;
    const maxCycles = 15 + (index * 5);
    
    const interval = setInterval(() => {
        slot.innerText = segments[index][Math.floor(Math.random() * segments[index].length)].toUpperCase();
        cycles++;
        if (cycles >= maxCycles) {
            clearInterval(interval);
            isSpinning[index] = false;
            slot.classList.remove('spinning');
            if (!isSpinning.includes(true)) updateResult();
        }
    }, 100);
}

function rollAll() { roll(0); setTimeout(() => roll(1), 200); setTimeout(() => roll(2), 400); }

function drawSigil(name) {
    const canvas = document.getElementById('sigilCanvas');
    const ctx = canvas.getContext('2d');
    canvas.classList.add('visible');
    ctx.clearRect(0, 0, 200, 200);
    const points = [];
    const radius = 70;
    const clean = name.toLowerCase().replace(/[^a-z]/g, '');
    for (let char of clean) {
        const angle = ((char.charCodeAt(0) - 97) / 26) * Math.PI * 2 - (Math.PI / 2);
        points.push({ x: 100 + radius * Math.cos(angle), y: 100 + radius * Math.sin(angle) });
    }
    if (!points.length) return;
    
    ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
    for (let p of points) ctx.lineTo(p.x, p.y);
    ctx.stroke();
    
    ctx.beginPath(); ctx.arc(points[0].x, points[0].y, 4, 0, 7); ctx.stroke();
    const last = points[points.length-1];
    ctx.beginPath();
    ctx.moveTo(last.x-5, last.y-5); ctx.lineTo(last.x+5, last.y+5);
    ctx.moveTo(last.x+5, last.y-5); ctx.lineTo(last.x-5, last.y+5);
    ctx.stroke();

    ctx.beginPath(); ctx.strokeStyle = '#330000'; ctx.arc(100, 100, 85, 0, 7); ctx.stroke();
}
