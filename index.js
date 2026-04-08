require('dotenv').config();
const express = require('express');
const {extractCV} = require('./pdfHandlers/pdfParser');
const {setCVText} = require('./pdfHandlers/cvStore');
const analyzerHandler = require('./routeHandlers/analyzerHandler');


const app = express();
app.use(express.json());

app.use('/', analyzerHandler);

async function start() {
    try {
        const text = await extractCV();
        setCVText(text);
        console.log('CV loaded successfully');

        app.listen(3000, () => console.log('Server running on port 3000'));
    } catch (err) {
        console.error('Failed to parse CV:', err);
        process.exit(1);
    }
}

start();