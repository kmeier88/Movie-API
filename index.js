const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [
    {
        title: 'Moon'
    },
    {
        title: 'Dargeeling Limited'
    },
    {
        title: 'Ghostbusters'
    },
    {
        title: 'Die Hard'
    },
    {
        title: 'Up'
    },
    {
        title: 'Dune'
    },
    {
        title: 'Casino Royale'
    },
    {
        title: 'Titane'
    },
    {
        title: 'Rugrats movie'
    },
    {
        title: 'The Iron Giant'
    }
]


app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('This is my top 10 movie list!');
});

//Returns list of all movies

app.get('/movies', (req, res) => {
  res.send ('Successful GET request returning data on all movies');
});

//Returns data about a single movie by title

app.get('/movies/:title', (req, res) => {
  res.send ('Successful GET request returning data about a single movie by title');
});

//Returns data about a genre by movie title

app.get('/movies/:title/:genre', (req, res) => {
  res.send ('Successful GET request returning data about a genre of movie by title');
});

//Returns data about a director

app.get('/movies/director/:director', (req, res) => {
  res.send ('Successful GET request returning data about a director');
});

//Adds new user

app.post('/users', (req, res) => {
  res.send ('Successful POST request allowing a user to register');
});

//Allows users to update their username

app.put('/users/:username', (req, res) => {
  res.send ('Successful PUT request allowing users to update their username');
});

//Allows users to add movie to list of favorites

app.post('/users/:favorites', (req, res) => {
  res.send ('Successfull POST request allowing users to add a movie to list of favorites');
});

//Allows users to remove movie from list of favorites

app.delete('/users/:favorites', (req, res) => {
  res.send ('Successful DELETE request allowing users to remove a movie from list of favorites');
});

//Allow existing user to deregister

app.delete('/users/:username', (req, res) => {
  res.send ('Sucessful DELETE request allowing users to deregister');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});