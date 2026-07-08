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
        { text: "Now, shall we begin?"}
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

