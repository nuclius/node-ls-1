// implement your API here
const express = require('express');
const User = require('./users/model.js');

const server = express();
const errorMessage = process.env.ERRORMSG || 'The user information could not be retrieved';

server.use(express.json());

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    res.status(400).json({
      message: 'Please provide name and bio for the user',
    });
  } else {
    User.insert(req.body)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(() => {
        res.status(500).json({
          message: 'There was an error while saving the user to the database',
        });
      });
  }
});

server.get('/api/users', (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({
        message: 'The users information could not be retrieved',
      });
    });
});

server.get('/api/users/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: 'The user with the specified ID does not exist',
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: errorMessage,
      });
    });
});

server.delete('/api/users/:id', (req, res) => {
  let user
  User.findById(req.params.id)
    .then(data => {
      if (!data) {
        res.status(404).json({
          message: 'The user with the specified ID does not exist',
        });
      } else {
        user = data
        return User.remove(req.params.id)
      }
    })
    .then(() => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(500).json({ message: 'The user could not be removed' });
    });
});

server.put('/api/users/:id', (req, res) => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    res.status(400).json({
      message: 'Please provide name and bio for the user',
    });
  } else {
    User.update(req.params.id, { name, bio })
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({
            message: 'The user with the specified ID does not exist',
          });
        }
      })
      .catch(() => {
        res.status(500).json({
          message: 'The user information could not be modified.',
        });
      });
  }
});

module.exports = server
