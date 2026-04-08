require('dotenv').config();
const express = require('express');
const analyzerHandler = require('./routeHandlers/analyzerHandler');


const app = express();
app.use(express.json());

app.use('/', analyzerHandler);

app.get('/', (req, res) => {
    res.redirect('/apply');
});

async function start() {
    try {
        app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();