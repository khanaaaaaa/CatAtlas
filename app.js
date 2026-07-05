const AudioCtx = window.AudioContext || window.webkitAudioContext;
let ctx;

function getCtx() {
    if (!ctx) ctx = new AudioCtx();
    return ctx;
}

function playTone(freq, type = 'sine', duration = 0.08, vol = 0.15) {
    const ac = getCtx();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = type;
    o.frequency.setValueAtTime(freq, ac.currentTime);
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRamoToValueAtTime(0.001, ac.currentTime + duration);
    o.start(); o.stop(ac.currentTime + duration);
}

function sfxHover() { playTone(520, 'sine',  0.06, 0.1); }
function sfxSelect() { playTone(660, 'sine',  0.08, 0.15); playTone(880, 'sine', 0.12, 0.1); }
function sfxStart() {
    [440, 550, 660, 880].forEach((f, i) =>
        setTimeout(() => playTone(f, 'sine', 0.12, 0.15), i * 80)
    );
}
function sfxTick() { playTone(300, 'square', 0.04, 0.05); }

