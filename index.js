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
  res.json(movies);
});

//Returns data about a single movie by title

app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.title === req.params.title }));
});

//Returns data about a genre by movie title

app.get('/movies/:title/:genre', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.genre === req.params.title }));
});

//Returns data about a director

app.get('/movies/:director', (req, res) => {
  res.json(movies.find((director) =>
    { return director.name === req.params.name }));
});

//Adds new user

app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

//Allows users to update their username

app.put('/users/:username', (req, res) => {
  let user = users.find((user) => { return user.username === req.params.username });

  if (user) {
    user.username[req.params.username] = parseInt(req.params.username);
    res.status(201).send('User was assigned a new username of ' + req.params.username);
  } else {
    res.status(404).send('User with the name ' + req.params.username + ' was not found.');
  }
});

//Allows users to add movie to list of favorites

app.post('/users/:favorites', (req, res) => {
  let favMovie = req.body;

  if (!movie.title) {
    const message = 'Missing name of movie in request body';
    res.status(400).send(message);
  } else {
    users.push(favMovie);
    res.status(201).send(favMovie);
  }
});

//Allows users to remove movie from list of favorites

app.delete('/users/:favorites', (req, res) => {
  let user = users.find((user) => { return user.favorites === req.params.favorites });

  if (user) {
    users = users.filter((obj) => { return obj.favorites !== req.params.favorites});
    res.status(201).send('Movie ' + req.params.favorites + ' was deleted.');
  }
});

//Allow existing user to deregister

app.delete('/users/:username', (req, res) => {
  let user = users.find((user) => { return user.username === req.params.username });

  if (user) {
    users = users.filter((obj) => { return obj.username !== req.params.username });
    res.status(201).send('User ' + req.params.username + ' was deleted.');
  }
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});