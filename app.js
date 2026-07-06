let audioCtx;
function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}
function playTone(freq, type = 'sine', duration = 0.08, vol = 0.12) {
    const ac = getCtx();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = type;
    o.frequency.setValueAtTime(freq, ac.currentTime);
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    o.start(); o.stop(ac.currentTime + duration);
}
function sfxTick()   { playTone(280, 'square', 0.04, 0.06); }
function sfxHover()  { playTone(520, 'sine',   0.06, 0.08); }
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
    'READY! ✦'
];

window.addEventListener('load', () => {
    const bar = document.getElementById('loadingBar');
    const cat = document.getElementById('loadingCat');
    const text = document.getElementById('loadingText');
    let progress = 0;

    const interval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 18 + 4, 100);
        bar.style.width = progress + '%';
        cat.style.left = loadingMessages[Math.min(Math.floor(progress / 20), loadingMessages.length - 1)];
        sfxTick();

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => showScreen('screen-select'), 500);
        }
    }, 320);
})