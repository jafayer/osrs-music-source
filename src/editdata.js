const fsPromises = require('fs').promises;

let data = [];
let final = {};

fsPromises.readFile('./data.json')
.then(res => JSON.parse(res))
.then(json => {
    /* insert code here */
    
    fsPromises.writeFile('./newdata.json',JSON.stringify(json), () => {
        console.log("DONE!");
    });
});