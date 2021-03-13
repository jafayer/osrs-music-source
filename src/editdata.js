const fsPromises = require('fs').promises;

let data = [];
let final = {};

fsPromises.readFile('./data.json')
.then(res => JSON.parse(res))
.then(json => {
    /* insert code here */
    let songs = json.songs;
    for(let song in songs) {
        songs[song].id = song;
    }

    json.songs = songs;
    console.log(json);
    console.log(json.version);
    console.log(json.songs.length);
    console.log(json.queue.length);
    fsPromises.writeFile('./newdata.json',JSON.stringify(json), () => {
        console.log("DONE!");
    });
});