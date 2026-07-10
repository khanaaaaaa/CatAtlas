const cat = JSON.parse(sessionStorage.getItem('selectedCat'));
if (!cat) window.location.href - 'index.html';

const visited = [];
const regions = new Set();
let knowledge = 0;
letcurrentCountry = null;

const reputations = [
    'Local Tourist',
    'Experienced Exploerer',
    'Master Traveler',
    'World Famous Cat',
    'Legendary Explorer'
]

const souvenirs = {
    'Japan': { name: 'Sakura Charm' },
    'France': { name: 'Mini Beret' },
    'Nepal': { name: 'Yak Plush' },
    'Brazil': { name: 'Carnival Feather' },
    'Egypt': { name: 'Mini Pyramid' },
    'Italy': { name: 'Pizza Pin' },
    'Australia': { name: 'Kangaroo Plush' },
    'Canada': { name: 'Maple Leaf Pin' },
    'India': { name: 'Diya Lamp' },
    'Greece': { name: 'Mini Column' },
    'Mexico': { name: 'Tiny Sombrero' },
    'China': { name: 'Paper Lantern' },
    'Peru': { name: 'Llama Plush' },
    'Iceland': { name: 'Aurora Snow Globe' },
    'Norway': { name: 'Viking Helmet Pin' },
    'Thailand': { name: 'Golden Temple Charm' },
    'Morocco': { name: 'Mosaic Title' },
    'Argentina': { name: 'Tango Ribbon' },
    'Portugal': { name: 'Azulejo Tile' },
    'New Zealand': { name: 'Kiwi Plush'},
};

const challenges = {
    'Japan': { q: 'What is Japan famous for?', correct: 'Cherry Blossoms', wrong: ['Big Ben', 'Pyramids'] },
    'France': { q: 'What is the capital of France?', correct: 'Paris', wrong: ['Rome', 'Madrid'] },
    'Nepal': { q: 'What is the tallest mountain of Earth?', correct: 'Mount Everest', wrong: ['K2', 'Mount Blanc'] },
    'Brazil': { q: 'What is the most popular festival in Brazil?', correct: 'Carnival', wrong: ['Oktoberfest', 'Diwali'] },
    'Egypt': { q: 'What ancient wonder is in Egypt?', correct: 'The Great Pyramid', wrong: ['The Colosseum', 'Stonehenge'] },
    'Italy': { q: 'Which Italian city is built on water?', correct: 'Venice', wrong: ['Naples', 'Turin'] },
    'Australia': { q: 'Australia is also classified as a what?', correct: 'Continent', wrong: ['Island chain', 'Peninsula'] },
    'Canada': { q: 'What is the Canadian national symbol?', correct: 'Maple Leaf', wrong: ['Eagle', 'Rose'] },
    'India': { q: 'What did ancient India invent?', correct: 'The number Zero', wrong: ['The wheel', 'Paper'] },
    'Greece': { q: 'Greece is the birthplace of what?', correct: 'Democracy', wrong: ['Football', 'Printing'] },
    'China': { q: 'What is the longest wall in the world?', correct: 'The Great Wall', wrong: ['Hadrian Wall', 'The Berlin Wall'] },
    'Peru': { q: 'What ancient city sits in the Andes in Peru?', correct: 'Machu Picchu', wrong: ['Chicken Itza', 'Angkor Wat'] },
    'Iceland': { q: 'What natural phenomen is Iceland famous for?', correct: 'Northern Lights', wrong: ['Monsoons', 'Tornadoes'] },
    'Morocco': { q: 'What is the capital of Thailand?', correct: 'Bangkok', wrong: ['Hanoi', 'Manila'] },
    'Argentina': { q: 'What continent is Morocco on?', correct: 'Africa', wrong: ['Asia', 'Europe'] },
    'New Zealand': { q: 'What is the indigenous people of New Zealand called?', correct: 'Maori', wrong: ['Inuit', 'Aboriginal'] }
}

const tutorialSteps = [
    { el: 'section-profile', text: 'This is your cat. Stats grow as you travel.' },
    { el: 'section-explore', text: 'Spin the globe to land on a random country and learn about it.' },
    { el: 'section-challenge', text: 'Answer the mini challenge to earn bonus knowledge.' },
    { el: 'section-map', text: 'Your world map fills up as you visit countries.' },
    { el: 'section-passport', text: 'Collect a passport stamp from every country you visit.' },
    { el: 'section-scrapbook', text: 'Your scrapbook saves facts and memories from every trip.' },
    { el: 'section-souvenirs', text: 'Some countries give you a unique souvenir to collect.' },
    { el: 'section-achievements', text: 'Complete achievements to become a Legendary Explorer.' }
];
let tutorialStep = 0;

let audioCtx;
function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}
function playTone(freq, type, dur, vol) {
    try {
        const ac = getCtx();
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, ac.currentTime);
        g.gain.setValueAtTime(vol || 0.1, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + (dur || 0.08));
        o.start(); o.stop(ac.currentTime + (dur || 0.08));
    } catch(e) {}
}
function sfxVisit()   { [440,550,660].forEach((f,i) => setTimeout(() => playTone(f,'sine',0.1,0.1), i*60)); }
function sfxCorrect() { [600,800].forEach((f,i) => setTimeout(() => playTone(f,'sine',0.12,0.1), i*80)); }
function sfxWrong() { playTone(200,'square',0.15,0.1); }
function sfxSpin() { playTone(300, 'sine',0.06,0.08); }

document.getElementById('bar-img').src = cat.img;
document.getElementById('bar-name').textContent = cat.name.toUpperCase();
document.getElementById('cat-img').src = cat.img;
document.getElementByIf('tip-img').src = cat.img;
document.getElementById('p-name').textContent = cat.name;
document.getElementById('p-type').textContent = cat.type;
document.getElementById('p-food').textContent = cat.food;

document.getElementById('cat-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        document.getElementById('cat-img').src = ev.target.result;
        document.getElementById('bar-img').src = ev.target.result;
        document.getElementById('tip-img').src = ev.target.result;
    };
    reader.readAsDataURL(file);
});

setTimeout(showTutorial, 800);

function showTutorial() {
    if (tutorialStep >= tutorialSteps.length) {
        document.getElementById('tip-box').classList.add('hidden');
        return;
    }
    const step = tutorialSteps[tutorialStep];
    document.getElementById('tip-text').textContent = step.text;
    document.getElementById('tip-box').classList.remove('hidden' );
    document.getElementById(step.el)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.getElementById('tip-btn').addEventListener('click', () => {
    tutorialStep++;
    showTutorial();
});

document.getElementById('spin-btn').addEventListener('click', async () => {
    const btn = document.getElementById('spin-btn');
    btn.disabled = true;
    btn.textContent = 'SPINNING...';
    sfxSpin();
    try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,population,languages,currencies,flags,region,area,borders,timezones');
        const all = await res.json();
        const c = all[Math.floor(Math.random() * all.length)];
        currentCountry = c.name.common;

        document.getElementById('c-flag').textContent     = c.flags?.emoji ?? '';
        document.getElementById('c-name').textContent     = currentCountry.toUpperCase();
        document.getElementById('c-capital').textContent  = c.capital?.[0] ?? 'Unknown';
        document.getElementById('c-region').textContent   = c.region ?? 'Unknown';
        document.getElementById('c-pop').textContent      = c.population.toLocaleString();
        document.getElementById('c-lang').textContent     = Object.values(c.languages ?? {}).join(', ') || 'Unknown';
        document.getElementById('c-currency').textContent = Object.values(c.currencies ?? {}).map(x => x.name + ' (' + x.symbol + ')').join(', ') || 'Unknown';
        document.getElementById('c-area').textContent     = c.area ? c.area.toLocaleString() + ' km2' : 'Unknown';
        document.getElementById('c-borders').textContent  = c.borders?.length ? c.borders.length + ' countries' : 'None';
        document.getElementById('c-timezone').textContent = c.timezones?.[0] ?? 'Unknown';

        const facts = [];
        if (c.borders?.length)         facts.push(currentCountry + ' shares borders with ' + c.borders.length + ' countries.');
        if (c.timezones?.length > 1)   facts.push('It spans ' + c.timezones.length + ' timezones.');
        if (c.population > 100000000)  facts.push('With over ' + Math.floor(c.population / 1000000) + ' million people, it is one of the most populated countries on Earth.');
        if (c.area > 1000000)          facts.push('It covers over ' + Math.floor(c.area / 1000000) + ' million km2, making it one of the largest countries by area.');
        document.getElementById('fun-fact').textContent = facts.length ? facts.join(' ') : currentCountry + ' is a fascinating country waiting to be explored.';

        document.getElementById('country-info').classList.remove('hidden');
    } catch(e) {
        alert('Could not fetch country')
    }
});
