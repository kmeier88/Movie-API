const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true, useUnifiedTopology: true });

//add process.env.connectionURI later

mongoose.connect('mongodb+srv://kmeier:wyXNdnhL3qUerKH@cluster0.0hesb.mongodb.net/myFlixDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { repeat } = require('lodash');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ 
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

let auth = require('./auth')(app);

const { check, validationResult } = require('express-validator');

const passport = require('passport');
require('./passport');

app.use(morgan('common'));


// default text response when at /

app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
});

//Returns list of all movies

app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// find all users

app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error.apply(err);
      res.status(500).send('Error: ' + err);
    });
});

//Returns data about a single movie by title

app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({Title: req.params.Title})
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error.apply(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get movie by Genre

app.get('/movies/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({'Genre.Name': req.params.name})
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error.apply(err);
      res.status(500).send('Error: ' + err);
    });
});

//show a director's movies by name

app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({'Director.Name': req.params.Name})
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((err) => {
      console.error.apply(err);
      res.status(500).send('Error: ' + err);
    });
});

//Adds new user

app.post('/users', [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
      return res.status(400).send(reg.body.Username + ' already exists')
    } else {
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      })
        .then((user) => {
          res.status(201).json(user);
        })
        .catch((err) => {
      console.error.apply(err);
      res.status(500).send('Error: ' + err);
    });
  }
})
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + err);
  });
});

//Allows users to update their info

app.put('/users/:username', [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], passport.authenticate('jwt', { session: false }), (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Allows users to add movie to list of favorites

app.post('/users/:username/FavoriteMovies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username},
    { $push: {FavoriteMovies: req.params.movieId} },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Allows users to remove movie from list of favorites

app.delete('/users/:username/FavoriteMovies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    {$pull: { FavoriteMovies: req.params.movieId } },
    { new: true },
    (error, updatedUser) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//Allow existing user to deregister

app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.username})
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found.');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error.apply(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});