const cat = JSON.parse(sessionStorage.getItem('selectedCat'));
if (!cat) window.location.href = 'index.html';

const scripts = {
    mochi: [
        { text: "Oh! A human! Are you here to take me on an adventure?"},
        { text: "I've been staring at this map for THREE hours."},
        { text: "I have one brain cell and it is FULLY dedicated to travel."},
        { text: "See that map behind me? Every grey country is waiting for us."},
        { text: "We're going to visit ALL of them. Even the tiny ones."},
        { text: "Pack the tuna. We leave immediately."},
    ],
    soba: [
        { text: "..."},
        { text: "You're late. I've already memorized 47 countries."},
        { text: "That map behind me?"},
        { text: "I've studied every border, every capital."},
        { text: "There are 195 countries, and we'll learn something from each one."},
        { text: "The only rule that you must follow is that you NEVER touch my Salmon."},
        { text: "Now, shall we begin?"},
        { text: "I have a schedule."}
    ],
    yuzu: [
        { text: "LETS GO!!!!"},
        { text: "I've been waiting for THIS MOMENT my whole life!!"},
        { text: "Look at that map!! SO MANY PLACES TO JUMP INTO!!"},
        { text: "I once jumped off a bookshelf to see what would happen."},
        { text: "It was amazing. This will be MORE amazing."},
        { text: "CHICKEN SNACKS PACKED. LET'S GO!!!"}
    ],
};

const lines = scripts[cat.key];
let lineIndex = 0;
let typing = false;
let typeTimer = null;

const map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    keyboard: false,
});

L.titleLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 5,
}).addTo(map);

map.setView([20, 10], 2);

let angle = 0;
setInterval(() => {
    angle += 0.015;
    map.panTo([20 + Math.sin(angle) * 8, 10 + angle * 0.4], { animate: true, duration: 2 });
}, 2000);

async function fetchRandomFact() {
    try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region');
        const all = await res.json();
        const c = all[Math.floor(Math.random() * all.length)];
        document.getElementById('fact-flag').textContent = c.flags?.emoji ?? '🏳';
        document.getElementById('fact-text').textContent =
            `${c.name.common.toUpperCase()} — Capital: ${c.capital?.[0] ?? '?'} · Pop: ${c.population.toLocaleString()}`;
        document.getElementById('country-fact').classList.remove('hidden');
    } catch { /* silent fail */ }
}

fetchRandomFact();
setInterval(fetchRandomFact, 6000);

document.getElementById('cat-img').src = cat.img;
document.getElementById('dialogue-name').textContent = cat.name.toUpperCase();

const dotsEl = document.getElementById('progress-dots');
lines.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot';
    d.id = `dot-${i}`;
    dotsEl.appendChild(d);
});

function typeLine(text) {
    const el = document.getElementById('dialogue-text');
    el.textContent = '';
    typing = true;
    let i = 0;
    clearInterval(typeTimer);
    typeTimer = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) { clearInterval(typeTimer); typing = false; }
    }, 36);
}

function showLine(index) {
    const line = lines[index];

    const moodEl = document.getElementById('cat-mood');
    moodEl.textContent = line.mood;
    moodEl.classList.remove('hidden');
    setTimeout(() => moodEl.classList.add('hidden'), 2000);

    const frame = document.getElementById('cat-frame');
    frame.className = '';
    frame.id = 'cat-frame';
    if (line.anim === 'excited') frame.classList.add('excited');
    else if (line.anim === 'nervous') frame.classList.add('nervous');

    if (index === lines.length - 1) document.getElementById('map').classList.add('alive');

    document.getElementById(`dot-${index}`)?.classList.add('done');

    typeLine(line.text);
}

showLine(0);

