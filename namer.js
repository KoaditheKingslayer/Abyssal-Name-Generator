const segments = [
    // SET A: The Ancient Authority (Prefixes)
    ["Bael", "Gulis", "Mord", "Malg", "Dra", "Khar", "Xul", "Vash", "Kthun", "Zar", "Zach", "Lo", "Mast", "Aza", "Vex", "Hadr"],

    // SET B: The Rhythmic Bridge (Infixes)
    ["and", "is", "ath", "al", "og", "un", "oz", "yth", "ech", "ona", "iax", "iz"],

    // SET C: The Final Seal (Suffixes)
    ["drax", "oth", "voss", "moth", "rax", "kuhl", "gorg", "eth", "uun", "dar", "el", "lo", "iel", "akh", "is"]
];

let isSpinning = [false, false, false];

async function roll(index) {
    if (isSpinning[index]) return;
    const slot = document.getElementById(`slot-${index}`);
    
    isSpinning[index] = true;
    toggleButtons(true);
    slot.classList.add('spinning');

    let cycles = 0;
    const maxCycles = 15 + (index * 5);
    
    const interval = setInterval(() => {
        const tempIndex = Math.floor(Math.random() * segments[index].length);
        slot.innerText = segments[index][tempIndex].toUpperCase();
        cycles++;

        if (cycles >= maxCycles) {
            clearInterval(interval);
            finalizeRoll(index, slot);
        }
    }, 100);
}

function finalizeRoll(index, slot) {
    // 15% chance to omit any given section
    const shouldOmit = Math.random() < 0.15;
    
    if (shouldOmit) {
        slot.innerText = "---";
        slot.dataset.value = ""; 
    } else {
        const finalValue = segments[index][Math.floor(Math.random() * segments[index].length)];
        slot.innerText = finalValue.toUpperCase();
        slot.dataset.value = finalValue;
    }

    slot.classList.remove('spinning');
    isSpinning[index] = false;

    // Check if all are done
    if (!isSpinning.includes(true)) {
        const s0 = document.getElementById('slot-0').dataset.value || "";
        const s1 = document.getElementById('slot-1').dataset.value || "";
        const s2 = document.getElementById('slot-2').dataset.value || "";

        // SANITY CHECK: If all 3 are omitted, force a re-roll of all
        if (s0 === "" && s1 === "" && s2 === "") {
            rollAll(); 
            return;
        }

        toggleButtons(false);
        updateResult();
    }
}

function rollAll() {
    roll(0);
    setTimeout(() => roll(1), 200);
    setTimeout(() => roll(2), 400);
}

function toggleButtons(disabled) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = disabled);
}

function updateResult() {
    const s0 = document.getElementById('slot-0').dataset.value || "";
    const s1 = document.getElementById('slot-1').dataset.value || "";
    const s2 = document.getElementById('slot-2').dataset.value || "";

    const fullName = (s0 + s1 + s2);
    const display = document.getElementById('final-name');
    
    if (fullName) {
        display.innerText = fullName.toUpperCase();
        drawSigil(fullName);
    } else {
        display.innerText = "--------";
    }
}

function drawSigil(name) {
    const canvas = document.getElementById('sigilCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.classList.add('visible');
    
    // Clear previous sigil
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const points = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 70; // Slightly smaller to ensure crossbars fit

    // Map name characters to points on a circle
    const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
    for (let i = 0; i < cleanName.length; i++) {
        const charCode = cleanName.charCodeAt(i) - 97; 
        const angle = (charCode / 26) * Math.PI * 2 - (Math.PI / 2); // Start at top
        points.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        });
    }

    if (points.length === 0) return;

    // Line Styles
    ctx.strokeStyle = '#ff3333';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // 1. Draw the Path
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // 2. Draw Start Marker (Circle)
    ctx.beginPath();
    ctx.fillStyle = '#1a1a1a';
    ctx.arc(points[0].x, points[0].y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3. Draw End Marker (Cross)
    const last = points[points.length - 1];
    ctx.beginPath();
    ctx.moveTo(last.x - 6, last.y - 6);
    ctx.lineTo(last.x + 6, last.y + 6);
    ctx.moveTo(last.x + 6, last.y - 6);
    ctx.lineTo(last.x - 6, last.y + 6);
    ctx.stroke();

    // 4. Draw Ambient Outer Rings
    ctx.beginPath();
    ctx.strokeStyle = '#330000';
    ctx.lineWidth = 1;
    ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
    ctx.setLineDash([5, 15]); // Dotted outer ring
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash
}