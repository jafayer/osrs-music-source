const express = require('express');
const request = require('request');
const fsPromises = require('fs').promises;
const xmlParser = require('xml2js').parseString;
const cors = require('cors');

const app = express();
app.use(cors());

var xmlTree;
var names;

fsPromises.readFile('./tree.xml')
.then(res => res.toString())
.then(text => {

    const xml = xmlParser(text, (err,res) => {
        xmlTree = res;
        let files = xmlTree['files']['file'];
        let oggs = files.filter(i => i['$']['name'].includes('.ogg'));
        names = oggs.map(i => i['$']['name']);
        
    })

})


app.get('/', (req,res) => {

    res.send(names);
})

app.listen(3001);