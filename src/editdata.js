const fsPromises = require('fs').promises;

let data = [];
let final = {};

fsPromises.readFile('./data.json')
.then(res => JSON.parse(res))
.then(json => {
    /* insert code here */
    let queue = ["Newbie Melody", "Yesteryear", "Autumn Voyage", "Adventure", "Harmony", "Fishing", "Garden", "Shine", "Home Sweet Home", "Background", "Dangerous", "Sea Shanty2", "Fanfare", "Baroque", "Barbarianism", "Work Work Work", "Camelot", "All's Fairy in Love and War", "Spirit", "Crystal Sword", "Doorways", "Nightfall", "Lightwalk", "Still Night", "Sea Shanty", "Pinball Wizard", "Wrath and Ruin", "Scape Main"];
    let queueSongs = queue.map(song => json.songs.find(j => j.title === song));
    json.queue = queueSongs;
    json.queue.forEach(song => console.log(song.filename));
    // fsPromises.writeFile('./newdata.json',JSON.stringify(json), () => {
    //     console.log("DONE!");
    // });
});