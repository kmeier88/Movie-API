const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [
    {
        title: Moon
    },
    {
        title: 
    }
]


app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('This is my top 10 movie list!');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});