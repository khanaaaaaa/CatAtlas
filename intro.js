const cat = JSON.parse(sessionStorage.getItem('selectedCat'));
if (!cat) window.location.href = 'index.html';

const scripts = {
    mochi: [
        { text: "Oh! A human! Are you here to take me somewhere?",              anim: "excited" },
        { text: "I have been staring at this map for three hours.",              anim: "nervous" },
        { text: "I have one brain cell and it is fully dedicated to travel.",    anim: "excited" },
        { text: "See all those countries back there? Every single one of them.", anim: "normal"  },
        { text: "We are going to visit all of them. Even the tiny ones.",        anim: "excited" },
        { text: "Tuna is packed. We leave right now.",                           anim: "excited" }
    ],
    soba: [
        { text: "...",                                                                 anim: "normal"  },
        { text: "You are late. I have already memorized 47 countries.",               anim: "normal"  },
        { text: "That map behind us. I have studied every border. Every capital.",    anim: "normal"  },
        { text: "195 countries. We will learn something real from each one.",         anim: "normal"  },
        { text: "One rule. Do not touch my salmon.",                                  anim: "nervous" },
        { text: "Good. Now let us begin. I have a schedule.",                         anim: "normal"  }
    ],
    yuzu: [
        { text: "LETS GO!!",                                                           anim: "excited" },
        { text: "I have been waiting for this my entire life!!",                       anim: "excited" },
        { text: "Look at that map!! So many places!!",                                 anim: "excited" },
        { text: "I once jumped off a bookshelf just to see what would happen.",        anim: "nervous" },
        { text: "It was amazing. This is going to be even more amazing.",              anim: "excited" },
        { text: "Chicken snacks are packed. Courage is at maximum. Lets go!!",        anim: "excited" }
    ]
};

const lines = scripts[cat.key];
let lineIndex = 0;
let typing = false;
let typeTimer = null;

let audioCtx;

function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function playTone(freq, type, dur, vol) {
    try {
        const ac = getCtx();
        const o  = ac.createOscillator();
        const g  = ac.createGain();
        o.connect(g);
        g.connect(ac.destination);
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, ac.currentTime);
        g.gain.setValueAtTime(vol || 0.07, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + (dur || 0.06));
        o.start();
        o.stop(ac.currentTime + (dur || 0.06));
    } catch(e) {}
}

const map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    keyboard: false
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 5
}).addTo(map);

map.setView([20, 10], 2);

let angle = 0;
setInterval(() => {
    angle += 0.012;
    map.panTo([20 + Math.sin(angle) * 6, 10 + angle * 0.3], { animate: true, duration: 2 });
}, 2200);

const factPool = [
    'Canada has the longest coastline of any country.',
    'Japan has the world\'s oldest company, founded in 578 AD.',
    'France is the most visited country in the world.',
    'Brazil contains 60% of the Amazon rainforest.',
    'Iceland runs on nearly 100% renewable energy.',
    'New Zealand was the first country to give women the right to vote.',
    'China borders more countries than any other nation.',
    'India invented the number zero and chess.',
    'Australia is the only country that is also a continent.',
    'Nepal is home to 8 of the world\'s 10 tallest mountains.',
    'South Korea has the fastest average internet speed in the world.',
    'Portugal is the oldest nation-state in Europe, founded in 1143.',
    'Indonesia is the world\'s largest archipelago with over 17,000 islands.',
    'South Africa has three capital cities.',
    'Turkey is home to the oldest known temple, Gobekli Tepe.'
];

function showFact() {
    const factEl = document.getElementById('country-fact');
    document.getElementById('fact-text').textContent = factPool[Math.floor(Math.random() * factPool.length)];
    factEl.classList.remove('hidden');
    factEl.style.animation = 'none';
    factEl.offsetHeight;
    factEl.style.animation = '';
}

showFact();
setInterval(showFact, 6000);

document.getElementById('cat-img').src = cat.img;
document.getElementById('dialogue-name').textContent = cat.name.toUpperCase();

const dotsEl = document.getElementById('progress-dots');
lines.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot';
    d.id = 'dot-' + i;
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
        playTone(i % 2 === 0 ? 420 : 380, 'sine', 0.03, 0.04);
        if (i >= text.length) {
            clearInterval(typeTimer);
            typing = false;
        }
    }, 38);
}

function showLine(index) {
    const line = lines[index];

    const frame = document.getElementById('cat-frame');
    frame.classList.remove('excited', 'nervous');
    if (line.anim === 'excited') frame.classList.add('excited');
    else if (line.anim === 'nervous') frame.classList.add('nervous');

    if (index === lines.length - 1) document.getElementById('map').classList.add('alive');

    const dot = document.getElementById('dot-' + index);
    if (dot) dot.classList.add('done');

    typeLine(line.text);
}

showLine(0);

document.getElementById('nextBtn').addEventListener('click', () => {
    if (typing) {
        clearInterval(typeTimer);
        document.getElementById('dialogue-text').textContent = lines[lineIndex].text;
        typing = false;
        return;
    }
    lineIndex++;
    if (lineIndex < lines.length) {
        showLine(lineIndex);
    } else {
        endIntro();
    }
});

document.getElementById('skipBtn').addEventListener('click', () => {
    clearInterval(typeTimer);
    lines.forEach((_, i) => {
        const dot = document.getElementById('dot-' + i);
        if (dot) dot.classList.add('done');
    });
    document.getElementById('map').classList.add('alive');
    endIntro();
});

function endIntro() {
    document.getElementById('cat-panel').style.display = 'none';
    document.getElementById('enterBtn').classList.remove('hidden');
}

document.getElementById('enterBtn').addEventListener('click', () => {
    window.location.href = 'game.html';
});

document.getElementById('nextBtn').addEventListener('mouseenter', () => playTone(500, 'sine', 0.05, 0.07));
