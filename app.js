let audioCtx;

function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function playTone(freq, type, duration, vol) {
    try {
        const ac = getCtx();
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.connect(g);
        g.connect(ac.destination);
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, ac.currentTime);
        g.gain.setValueAtTime(vol || 0.1, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + (duration || 0.08));
        o.start();
        o.stop(ac.currentTime + (duration || 0.08));
    } catch(e) {}
}

function sfxTick()   { playTone(280, 'square', 0.04, 0.06); }
function sfxHover()  { playTone(520, 'sine', 0.06, 0.08); }
function sfxSelect() {
    playTone(600, 'sine', 0.08, 0.12);
    setTimeout(() => playTone(800, 'sine', 0.1, 0.1), 80);
}
function sfxStart() {
    [440, 550, 660, 880].forEach((f, i) =>
        setTimeout(() => playTone(f, 'sine', 0.14, 0.13), i * 90)
    );
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

const loadingMessages = [
    'LOADING...',
    'PACKING SUITCASE...',
    'FINDING PASSPORT...',
    'BRIBING THE PILOT...',
    'ALMOST READY...',
    'READY'
];

window.addEventListener('load', () => {
    const bar  = document.getElementById('loadingBar');
    const text = document.getElementById('loadingText');
    let progress = 0;

    const interval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 18 + 4, 100);
        bar.style.width = progress + '%';
        text.textContent = loadingMessages[Math.min(Math.floor(progress / 20), loadingMessages.length - 1)];
        sfxTick();

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => showScreen('screen-select'), 500);
        }
    }, 320);
});

const previews = {
    mochi: 'Mochi has one brain cell. It dreams of tuna and distant mountains.',
    soba:  'Soba has read every atlas ever printed. Twice.',
    yuzu:  'Yuzu once jumped off a bookshelf just to see what would happen.'
};

let selectedCat = null;

document.querySelectorAll('.cat-option').forEach(option => {
    option.addEventListener('mouseenter', () => sfxHover());
    option.addEventListener('click', () => {
        document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        sfxSelect();

        selectedCat = {
            name: option.dataset.cat.charAt(0).toUpperCase() + option.dataset.cat.slice(1),
            key:  option.dataset.cat,
            type: option.dataset.type,
            food: option.dataset.food,
            img:  option.dataset.img
        };

        document.getElementById('previewText').textContent = previews[option.dataset.cat];
        document.getElementById('selectedPreview').classList.remove('hidden');
        document.getElementById('selectCatBtn').disabled = false;
    });
});

document.getElementById('selectCatBtn').addEventListener('click', () => {
    if (!selectedCat) return;
    sfxStart();
    sessionStorage.setItem('selectedCat', JSON.stringify(selectedCat));
    setTimeout(() => window.location.href = 'intro.html', 400);
});
