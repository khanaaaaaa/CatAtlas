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

const spinMessages = [
    'ooh ooh ooh...', 'hmm let me see...', 'closing my eyes...', 'spinning...', 'where to next...', 'not there... not there...'
];

const visitReactions = [
    'packing my bags!', 'let\'s gooo!', 'i\'ve always wanted to go here!', 'adding this to my memories.', 'another stamp for the passport!', 'this place looks amazing.'
];

const tips = [
    { el:'section-profile',      text:'that\'s you! your stats grow the more you travel.' },
    { el:'section-explore',      text:'spin the globe and see where the wind takes you.' },
    { el:'section-challenge',    text:'answer the quiz to earn extra knowledge points.' },
    { el:'section-map',          text:'every country you visit shows up here.' },
    { el:'section-passport',     text:'collect stamps from every country you visit.' },
    { el:'section-scrapbook',    text:'your scrapbook fills up with memories as you go.' },
    { el:'section-souvenirs',    text:'some places leave you with a little something.' },
    { el:'section-achievements', text:'keep exploring to unlock these.' }
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

get('bar-img').src = cat.img;
get('cat-img').src = cat.img;
get('tip-img').src = cat.img;
set('bar-name', cat.name.toUpperCase());
set('p-name', cat.name);
set('p-name-d', cat.name);
set('p-type', cat.type);
set('p-food', cat.food);

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

document.querySelectorAll('.dock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const panelId = btn.dataset.panel;
        const drawer = get('drawer');
        const already = btn.classList.contains('active');

        document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

        if (already) {
            drawer.classList.add('closing');
            setTimeout(() => { drawer.classList.add('hidden'); drawer.classList.remove('closing'); }, 180);
        } else {
            btn.classList.add('active');
            get(panelId).classList.add('active');
            drawer.classList.remove('hidden', 'closing');
        }
    });
});

get('drawer-close').addEventListener('click', () => {
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const drawer = get('drawer');
    drawer.classList.add('closing');
    setTimeout(() => { drawer.classList.add('hidden'); drawer.classList.remove('closing'); }, 180);
});

get('tip-btn').addEventListener('click', () => { tipStep++; nextTip(); });

const countries = [
    { name:'Japan',       capital:'Tokyo',          region:'Asia',          pop:'125,700,000', lang:'Japanese',          currency:'Yen (JPY)',            area:'377,975 km2',  borders:4,  tz:'UTC+09:00', fact:'Japan has the world\'s oldest company, founded in 578 AD.' },
    { name:'France',      capital:'Paris',          region:'Europe',        pop:'67,400,000',  lang:'French',            currency:'Euro (EUR)',           area:'551,695 km2',  borders:8,  tz:'UTC+01:00', fact:'France is the most visited country in the world.' },
    { name:'Brazil',      capital:'Brasilia',       region:'Americas',      pop:'214,300,000', lang:'Portuguese',        currency:'Real (BRL)',           area:'8,515,767 km2',borders:10, tz:'UTC-03:00', fact:'Brazil contains 60% of the Amazon rainforest.' },
    { name:'Egypt',       capital:'Cairo',          region:'Africa',        pop:'102,300,000', lang:'Arabic',            currency:'Pound (EGP)',          area:'1,002,450 km2',borders:4,  tz:'UTC+02:00', fact:'Egypt has more ancient monuments than any other country.' },
    { name:'Canada',      capital:'Ottawa',         region:'Americas',      pop:'38,200,000',  lang:'English, French',   currency:'Dollar (CAD)',         area:'9,984,670 km2',borders:1,  tz:'UTC-05:00', fact:'Canada has the longest coastline of any country.' },
    { name:'Australia',   capital:'Canberra',       region:'Oceania',       pop:'25,700,000',  lang:'English',           currency:'Dollar (AUD)',         area:'7,692,024 km2',borders:0,  tz:'UTC+10:00', fact:'Australia is the only country that is also a continent.' },
    { name:'India',       capital:'New Delhi',      region:'Asia',          pop:'1,380,000,000',lang:'Hindi, English',   currency:'Rupee (INR)',          area:'3,287,263 km2',borders:6,  tz:'UTC+05:30', fact:'India invented the number zero and chess.' },
    { name:'Italy',       capital:'Rome',           region:'Europe',        pop:'60,300,000',  lang:'Italian',           currency:'Euro (EUR)',           area:'301,340 km2',  borders:6,  tz:'UTC+01:00', fact:'Italy has more UNESCO World Heritage Sites than any other country.' },
    { name:'Mexico',      capital:'Mexico City',    region:'Americas',      pop:'128,900,000', lang:'Spanish',           currency:'Peso (MXN)',           area:'1,964,375 km2',borders:3,  tz:'UTC-06:00', fact:'Mexico City is built on the ruins of the Aztec capital Tenochtitlan.' },
    { name:'Norway',      capital:'Oslo',           region:'Europe',        pop:'5,400,000',   lang:'Norwegian',         currency:'Krone (NOK)',          area:'323,802 km2',  borders:3,  tz:'UTC+01:00', fact:'Norway has the longest road tunnel in the world at 24.5 km.' },
    { name:'Nepal',       capital:'Kathmandu',      region:'Asia',          pop:'29,100,000',  lang:'Nepali',            currency:'Rupee (NPR)',          area:'147,181 km2',  borders:2,  tz:'UTC+05:45', fact:'Nepal is home to 8 of the world\'s 10 tallest mountains.' },
    { name:'Iceland',     capital:'Reykjavik',      region:'Europe',        pop:'370,000',     lang:'Icelandic',         currency:'Krona (ISK)',          area:'103,000 km2',  borders:0,  tz:'UTC+00:00', fact:'Iceland runs on nearly 100% renewable energy.' },
    { name:'Greece',      capital:'Athens',         region:'Europe',        pop:'10,700,000',  lang:'Greek',             currency:'Euro (EUR)',           area:'131,957 km2',  borders:4,  tz:'UTC+02:00', fact:'Greece has the longest coastline in Europe.' },
    { name:'China',       capital:'Beijing',        region:'Asia',          pop:'1,412,000,000',lang:'Mandarin',         currency:'Yuan (CNY)',           area:'9,596,960 km2',borders:14, tz:'UTC+08:00', fact:'China borders more countries than any other nation.' },
    { name:'Peru',        capital:'Lima',           region:'Americas',      pop:'32,900,000',  lang:'Spanish',           currency:'Sol (PEN)',            area:'1,285,216 km2',borders:5,  tz:'UTC-05:00', fact:'Machu Picchu sits at 2,430 metres above sea level.' },
    { name:'Morocco',     capital:'Rabat',          region:'Africa',        pop:'37,100,000',  lang:'Arabic, Berber',    currency:'Dirham (MAD)',         area:'446,550 km2',  borders:2,  tz:'UTC+01:00', fact:'Morocco is the only African country with coasts on two seas.' },
    { name:'Argentina',   capital:'Buenos Aires',   region:'Americas',      pop:'45,600,000',  lang:'Spanish',           currency:'Peso (ARS)',           area:'2,780,400 km2',borders:5,  tz:'UTC-03:00', fact:'Argentina is the 8th largest country in the world.' },
    { name:'Thailand',    capital:'Bangkok',        region:'Asia',          pop:'71,600,000',  lang:'Thai',              currency:'Baht (THB)',           area:'513,120 km2',  borders:5,  tz:'UTC+07:00', fact:'Thailand is the only Southeast Asian country never colonised.' },
    { name:'Portugal',    capital:'Lisbon',         region:'Europe',        pop:'10,300,000',  lang:'Portuguese',        currency:'Euro (EUR)',           area:'92,212 km2',   borders:1,  tz:'UTC+00:00', fact:'Portugal is the oldest nation-state in Europe, founded in 1143.' },
    { name:'New Zealand', capital:'Wellington',     region:'Oceania',       pop:'5,100,000',   lang:'English, Maori',    currency:'Dollar (NZD)',         area:'270,467 km2',  borders:0,  tz:'UTC+12:00', fact:'New Zealand was the first country to give women the right to vote.' },
    { name:'South Korea', capital:'Seoul',          region:'Asia',          pop:'51,700,000',  lang:'Korean',            currency:'Won (KRW)',            area:'100,210 km2',  borders:1,  tz:'UTC+09:00', fact:'South Korea has the fastest average internet speed in the world.' },
    { name:'Kenya',       capital:'Nairobi',        region:'Africa',        pop:'54,000,000',  lang:'Swahili, English',  currency:'Shilling (KES)',       area:'580,367 km2',  borders:5,  tz:'UTC+03:00', fact:'Kenya is home to the Great Rift Valley.' },
    { name:'Sweden',      capital:'Stockholm',      region:'Europe',        pop:'10,400,000',  lang:'Swedish',           currency:'Krona (SEK)',          area:'450,295 km2',  borders:2,  tz:'UTC+01:00', fact:'Sweden has more islands than any other country in the world.' },
    { name:'Turkey',      capital:'Ankara',         region:'Asia',          pop:'84,300,000',  lang:'Turkish',           currency:'Lira (TRY)',           area:'783,562 km2',  borders:8,  tz:'UTC+03:00', fact:'Turkey is home to the oldest known temple, Gobekli Tepe.' },
    { name:'Colombia',    capital:'Bogota',         region:'Americas',      pop:'51,200,000',  lang:'Spanish',           currency:'Peso (COP)',           area:'1,141,748 km2',borders:5,  tz:'UTC-05:00', fact:'Colombia is the only country in South America with coasts on two oceans.' },
    { name:'Nigeria',     capital:'Abuja',          region:'Africa',        pop:'211,400,000', lang:'English',           currency:'Naira (NGN)',          area:'923,768 km2',  borders:4,  tz:'UTC+01:00', fact:'Nigeria is the most populous country in Africa.' },
    { name:'Germany',     capital:'Berlin',         region:'Europe',        pop:'83,200,000',  lang:'German',            currency:'Euro (EUR)',           area:'357,114 km2',  borders:9,  tz:'UTC+01:00', fact:'Germany has over 1,500 different types of beer.' },
    { name:'Spain',       capital:'Madrid',         region:'Europe',        pop:'47,400,000',  lang:'Spanish',           currency:'Euro (EUR)',           area:'505,990 km2',  borders:5,  tz:'UTC+01:00', fact:'Spain is the second largest country in the European Union.' },
    { name:'Indonesia',   capital:'Jakarta',        region:'Asia',          pop:'273,500,000', lang:'Indonesian',        currency:'Rupiah (IDR)',         area:'1,904,569 km2',borders:3,  tz:'UTC+07:00', fact:'Indonesia is the world\'s largest archipelago with over 17,000 islands.' },
    { name:'South Africa',capital:'Pretoria',       region:'Africa',        pop:'60,000,000',  lang:'Zulu, Xhosa, Afrikaans',currency:'Rand (ZAR)',      area:'1,219,090 km2',borders:6,  tz:'UTC+02:00', fact:'South Africa has three capital cities.' }
];

get('spin-btn').addEventListener('click', () => {
    const btn = get('spin-btn');
    btn.disabled = true;
    btn.classList.add('spinning');
    btn.textContent = spinMessages[Math.floor(Math.random() * spinMessages.length)];
    tone(300,'sine',0.06,0.08);

    setTimeout(() => {
        const c = countries[Math.floor(Math.random() * countries.length)];
        currentCountry = c.name;

        set('c-flag',     c.name.slice(0,2).toUpperCase());
        set('c-name',     currentCountry);
        set('c-capital',  c.capital);
        set('c-region',   c.region);
        set('c-pop',      c.pop);
        set('c-lang',     c.lang);
        set('c-currency', c.currency);
        set('c-area',     c.area);
        set('c-borders',  c.borders ? c.borders + ' countries' : 'none');
        set('c-timezone', c.tz);
        set('fun-fact',   c.fact);

        const vBtn = get('visit-btn');
        if (visited.includes(currentCountry)) {
            vBtn.textContent = 'already been here!';
            vBtn.classList.add('visited');
        } else {
            vBtn.textContent = "let's go here!";
            vBtn.classList.remove('visited');
        }

        get('country-info').classList.remove('hidden');
        btn.classList.remove('spinning');
        btn.disabled = false;
        btn.textContent = 'spin again';
    }, 700);
});

get('visit-btn').addEventListener('click', () => {
    if (!currentCountry || visited.includes(currentCountry)) return;
    visited.push(currentCountry);
    regions.add(get('c-region').textContent);
    tone(440,'sine',0.1,0.1);
    setTimeout(() => tone(550,'sine',0.1,0.1), 60);
    setTimeout(() => tone(660,'sine',0.1,0.1), 120);

    get('visit-btn').textContent = visitReactions[Math.floor(Math.random() * visitReactions.length)];
    get('visit-btn').classList.add('visited');
    setTimeout(() => { get('visit-btn').textContent = 'already been here!'; }, 1800);

    set('p-trips', visited.length);
    set('p-trips-label', visited.length + (visited.length === 1 ? ' trip' : ' trips'));
    knowledge = Math.min(100, knowledge + 10);
    get('knowledge-fill').style.width = knowledge + '%';
    set('knowledge-val', knowledge);
    get('bar-knowledge').style.width = knowledge + '%';
    get('bar-trips').style.width = Math.min((visited.length / 195) * 100, 100) + '%';

    const rep = reputations[Math.min(Math.floor(visited.length / 5), reputations.length - 1)];
    set('rep-title', rep);
    set('bar-rep', rep);

    set('map-count', visited.length === 1 ? '1 country so far!' : visited.length + ' countries and counting!');
    const dot = document.createElement('div');
    dot.className = 'map-dot';
    dot.textContent = currentCountry.slice(0, 3).toUpperCase();
    dot.title = currentCountry;
    get('map-grid').appendChild(dot);

    get('passport-empty').style.display = 'none';
    const stamp = document.createElement('div');
    stamp.className = 'stamp';
    stamp.innerHTML = '<span>' + get('c-flag').textContent + '</span><br>' + (get('c-capital').textContent || currentCountry).toUpperCase();
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

    if (visited.length === 1)  unlock('ach-first', '[x] first trip taken');
    if (visited.length === 25) unlock('ach-25',    '[x] 25 countries visited');
    if (['Nepal','Switzerland','Peru','Austria','Norway'].some(c => visited.includes(c)))                                    unlock('ach-mountain', '[x] mountain explorer');
    if (['Japan','Italy','France','India','Mexico','Thailand'].filter(c => visited.includes(c)).length >= 3)                 unlock('ach-food',     '[x] international food critic');
    if (regions.size >= 6)                                                                                                   unlock('ach-continent','[x] visited every continent');
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