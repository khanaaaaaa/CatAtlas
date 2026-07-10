const cat = JSON.parse(sessionStorage.getItem('selectedCat'));
if (!cat) window.location.href = 'index.html';

const visited = [];
const regions = new Set();
let knowledge = 0;
let currentCountry = null;

const reputations = ['Local Tourist','Experienced Explorer','Master Traveler','World Famous Cat','Legendary Explorer'];

const souvenirs = {
    'Japan':'Sakura Charm','France':'Mini Beret','Nepal':'Yak Plush','Brazil':'Carnival Feather',
    'Egypt':'Mini Pyramid','Italy':'Pizza Pin','Australia':'Kangaroo Plush','Canada':'Maple Leaf Pin',
    'India':'Diya Lamp','Greece':'Mini Column','Mexico':'Tiny Sombrero','China':'Paper Lantern',
    'Peru':'Llama Plush','Iceland':'Aurora Snow Globe','Norway':'Viking Helmet Pin',
    'Thailand':'Golden Temple Charm','Morocco':'Mosaic Tile','Argentina':'Tango Ribbon',
    'Portugal':'Azulejo Tile','New Zealand':'Kiwi Plush'
};

const challenges = {
    'Japan':       { q:'What is Japan famous for?',                           a:'Cherry Blossoms',  w:['Big Ben','Pyramids'] },
    'France':      { q:'What is the capital of France?',                      a:'Paris',            w:['Rome','Madrid'] },
    'Nepal':       { q:'What is the tallest mountain on Earth?',              a:'Mount Everest',    w:['K2','Mont Blanc'] },
    'Brazil':      { q:'What is Brazil most famous festival?',                a:'Carnival',         w:['Oktoberfest','Diwali'] },
    'Egypt':       { q:'What ancient wonder is in Egypt?',                    a:'The Great Pyramid',w:['The Colosseum','Stonehenge'] },
    'Italy':       { q:'Which Italian city is built on water?',               a:'Venice',           w:['Naples','Turin'] },
    'Australia':   { q:'Australia is also classified as a what?',             a:'Continent',        w:['Island chain','Peninsula'] },
    'Canada':      { q:'What is the Canadian national symbol?',               a:'Maple Leaf',       w:['Eagle','Rose'] },
    'India':       { q:'What did ancient India invent?',                      a:'The number zero',  w:['The wheel','Paper'] },
    'Greece':      { q:'Greece is the birthplace of what?',                   a:'Democracy',        w:['Football','Printing'] },
    'China':       { q:'What is the longest wall in the world?',              a:'The Great Wall',   w:['Hadrian Wall','Berlin Wall'] },
    'Peru':        { q:'What ancient city sits in the Andes?',                a:'Machu Picchu',     w:['Chichen Itza','Angkor Wat'] },
    'Iceland':     { q:'What natural phenomenon is Iceland famous for?',      a:'Northern Lights',  w:['Monsoons','Tornadoes'] },
    'Mexico':      { q:'What civilization built pyramids in Mexico?',         a:'The Aztecs',       w:['The Romans','The Greeks'] },
    'Thailand':    { q:'What is the capital of Thailand?',                    a:'Bangkok',          w:['Hanoi','Manila'] },
    'Morocco':     { q:'What continent is Morocco on?',                       a:'Africa',           w:['Asia','Europe'] },
    'Argentina':   { q:'What dance originated in Argentina?',                 a:'Tango',            w:['Salsa','Flamenco'] },
    'New Zealand': { q:'What are the indigenous people of New Zealand called?',a:'Maori',           w:['Inuit','Aboriginal'] }
};

const tips = [
    { el:'section-profile',      text:'This is your cat. Stats grow as you travel.' },
    { el:'section-explore',      text:'Spin the globe to land on a random country.' },
    { el:'section-challenge',    text:'Answer the mini challenge to earn bonus knowledge.' },
    { el:'section-map',          text:'Your world map fills up as you visit countries.' },
    { el:'section-passport',     text:'Collect a passport stamp from every country.' },
    { el:'section-scrapbook',    text:'Your scrapbook saves facts from every trip.' },
    { el:'section-souvenirs',    text:'Some countries give you a unique souvenir.' },
    { el:'section-achievements', text:'Complete achievements to become a Legendary Explorer.' }
];
let tipStep = 0;

let audioCtx;
function tone(freq, type, dur, vol) {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, audioCtx.currentTime);
        g.gain.setValueAtTime(vol || 0.1, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (dur || 0.08));
        o.start(); o.stop(audioCtx.currentTime + (dur || 0.08));
    } catch(e) {}
}

function set(id, val) { document.getElementById(id).textContent = val; }
function get(id) { return document.getElementById(id); }

get('bar-img').src  = cat.img;
get('cat-img').src  = cat.img;
get('tip-img').src  = cat.img;
set('bar-name', cat.name.toUpperCase());
set('p-name',   cat.name);
set('p-type',   cat.type);
set('p-food',   cat.food);

get('cat-upload').addEventListener('change', e => {
    if (!e.target.files[0]) return;
    const r = new FileReader();
    r.onload = ev => {
        get('cat-img').src = ev.target.result;
        get('bar-img').src = ev.target.result;
        get('tip-img').src = ev.target.result;
    };
    r.readAsDataURL(e.target.files[0]);
});

setTimeout(nextTip, 800);

function nextTip() {
    if (tipStep >= tips.length) { get('tip-box').classList.add('hidden'); return; }
    set('tip-text', tips[tipStep].text);
    get('tip-box').classList.remove('hidden');
    get(tips[tipStep].el).scrollIntoView({ behavior:'smooth', block:'center' });
}

get('tip-btn').addEventListener('click', () => { tipStep++; nextTip(); });

get('spin-btn').addEventListener('click', async () => {
    const btn = get('spin-btn');
    btn.disabled = true;
    btn.textContent = 'SPINNING...';
    tone(300,'sine',0.06,0.08);
    try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,population,languages,currencies,flags,region,area,borders,timezones');
        const all = await res.json();
        const c   = all[Math.floor(Math.random() * all.length)];
        currentCountry = c.name.common;

        set('c-flag',     c.flags?.emoji ?? '');
        set('c-name',     currentCountry.toUpperCase());
        set('c-capital',  c.capital?.[0] ?? 'Unknown');
        set('c-region',   c.region ?? 'Unknown');
        set('c-pop',      c.population.toLocaleString());
        set('c-lang',     Object.values(c.languages ?? {}).join(', ') || 'Unknown');
        set('c-currency', Object.values(c.currencies ?? {}).map(x => x.name + ' (' + x.symbol + ')').join(', ') || 'Unknown');
        set('c-area',     c.area ? c.area.toLocaleString() + ' km2' : 'Unknown');
        set('c-borders',  c.borders?.length ? c.borders.length + ' countries' : 'None');
        set('c-timezone', c.timezones?.[0] ?? 'Unknown');

        const facts = [];
        if (c.borders?.length)        facts.push(currentCountry + ' shares borders with ' + c.borders.length + ' countries.');
        if (c.timezones?.length > 1)  facts.push('It spans ' + c.timezones.length + ' timezones.');
        if (c.population > 100000000) facts.push('Over ' + Math.floor(c.population/1000000) + ' million people live here.');
        if (c.area > 1000000)         facts.push('It covers over ' + Math.floor(c.area/1000000) + ' million km2.');
        set('fun-fact', facts.length ? facts.join(' ') : currentCountry + ' is a fascinating country waiting to be explored.');

        get('country-info').classList.remove('hidden');
    } catch(e) {
        alert('Could not fetch country. Check your connection.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'SPIN THE GLOBE';
    }
});

get('visit-btn').addEventListener('click', () => {
    if (!currentCountry || visited.includes(currentCountry)) return;
    visited.push(currentCountry);
    regions.add(get('c-region').textContent);
    tone(440,'sine',0.1,0.1);
    setTimeout(() => tone(550,'sine',0.1,0.1), 60);
    setTimeout(() => tone(660,'sine',0.1,0.1), 120);

    set('p-trips', visited.length);
    knowledge = Math.min(100, knowledge + 10);
    get('knowledge-fill').style.width = knowledge + '%';
    set('knowledge-val', knowledge);
    get('bar-knowledge').style.width = knowledge + '%';
    get('bar-trips').style.width = Math.min((visited.length / 195) * 100, 100) + '%';

    const rep = reputations[Math.min(Math.floor(visited.length / 5), reputations.length - 1)];
    set('rep-title', rep);
    set('bar-rep', rep);

    set('map-count', visited.length + ' countries visited.');
    const dot = document.createElement('div');
    dot.className = 'map-dot';
    dot.textContent = currentCountry.slice(0, 3).toUpperCase();
    dot.title = currentCountry;
    get('map-grid').appendChild(dot);

    get('passport-empty').style.display = 'none';
    const stamp = document.createElement('div');
    stamp.className = 'stamp';
    stamp.innerHTML = get('c-flag').textContent + '<br>' + (get('c-capital').textContent || currentCountry).toUpperCase();
    get('stamps').appendChild(stamp);

    get('scrapbook-empty').style.display = 'none';
    const page = document.createElement('div');
    page.className = 'scrapbook-page';
    page.innerHTML =
        '<div class="page-title">' + get('c-flag').textContent + ' ' + currentCountry.toUpperCase() + '</div>' +
        '<p><span>CAPITAL</span> '  + get('c-capital').textContent  + '</p>' +
        '<p><span>REGION</span> '   + get('c-region').textContent   + '</p>' +
        '<p><span>LANGUAGE</span> ' + get('c-lang').textContent     + '</p>' +
        '<p><span>NOTE</span> '     + get('fun-fact').textContent   + '</p>';
    get('scrapbook-pages').prepend(page);

    if (souvenirs[currentCountry]) {
        get('souvenir-empty').style.display = 'none';
        const item = document.createElement('div');
        item.className = 'souvenir';
        item.textContent = souvenirs[currentCountry].slice(0, 3).toUpperCase();
        item.setAttribute('data-name', souvenirs[currentCountry]);
        get('souvenir-grid').appendChild(item);
    }

    loadChallenge(currentCountry);

    if (['Norway','Iceland'].includes(currentCountry))                       markGoal('goal-1');
    if (['Nepal','Switzerland','Peru','Austria'].includes(currentCountry))   markGoal('goal-2');
    if (['Japan','France','Germany','Switzerland'].includes(currentCountry)) markGoal('goal-3');

    if (visited.length === 1)  unlock('ach-first', '[x] First Trip');
    if (visited.length === 25) unlock('ach-25',    '[x] Visited 25 Countries');
    if (['Nepal','Switzerland','Peru','Austria','Norway'].some(c => visited.includes(c)))                                    unlock('ach-mountain', '[x] Mountain Explorer');
    if (['Japan','Italy','France','India','Mexico','Thailand'].filter(c => visited.includes(c)).length >= 3)                 unlock('ach-food',     '[x] International Food Critic');
    if (regions.size >= 6)                                                                                                   unlock('ach-continent','[x] Visited Every Continent');
});

function loadChallenge(country) {
    const d = challenges[country];
    if (!d) { get('challenge-box').innerHTML = '<p class="placeholder">' + country + ' -- no challenge yet.</p>'; return; }
    const opts = [d.a, ...d.w].sort(() => Math.random() - 0.5);
    get('challenge-box').innerHTML =
        '<p class="challenge-q">' + d.q + '</p>' +
        '<div class="challenge-opts">' +
        opts.map(o => '<button onclick="answer(this,\'' + o + '\',\'' + d.a + '\')">' + o + '</button>').join('') +
        '</div>';
}

function answer(btn, chosen, correct) {
    document.querySelectorAll('.challenge-opts button').forEach(b => b.disabled = true);
    if (chosen === correct) {
        btn.classList.add('correct');
        tone(600,'sine',0.12,0.1);
        setTimeout(() => tone(800,'sine',0.12,0.1), 80);
        knowledge = Math.min(100, knowledge + 5);
        get('knowledge-fill').style.width = knowledge + '%';
        set('knowledge-val', knowledge);
        get('bar-knowledge').style.width = knowledge + '%';
    } else {
        btn.classList.add('wrong');
        tone(200,'square',0.15,0.1);
        document.querySelectorAll('.challenge-opts button').forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
    }
}

function markGoal(id) {
    const el = get(id);
    if (el) el.textContent = el.textContent.replace('[ ]', '[x]');
}

function unlock(id, text) {
    const el = get(id);
    if (el && el.classList.contains('locked')) { el.textContent = text; el.classList.replace('locked','unlocked'); }
}
