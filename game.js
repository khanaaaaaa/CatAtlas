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

