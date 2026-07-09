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