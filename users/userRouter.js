const express = require('express');

const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({message: "There was an issue adding the user to the database."})
      console.log(err)
    })
});

router.post('/:id/posts', validatePost, (req, res) => {
  const { id } = req.params;

      Posts.insert(req.body)
        .then(inserted => {
          res.status(200).json(inserted)
        })
        .catch(err => {
          res.status(500).json({error: "There was an error attempting to add a post."})
          console.log(err)
        })
});

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({message: "There was in issue when attempting to retrieve users data."})
    })
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Users.getById(id)
    .then(user => {
      if(user){
        res.status(200).json(user);
      } else {
        res.status(404).json({error: "The user with the specified ID does not exist."})
      }
    })
    .catch(err => {
      res.status(500).json({message: "There was an issue retrieving the data."})
    })
});

router.get('/:id/posts', (req, res) => {
  const { id } = req.params;

  Users.getUserPosts(id)
    .then(userPosts => {
      if(userPosts.length === 0){
        res.status(404).json({message: "The user's post were not found."})
      } else {
        res.status(200).json(userPosts)
      }   
    })
    .catch(err => {
      res.status(500).json({errorMessage: "There was an issue retrieving the user's posts."})
    })
});

router.delete('/:id', validateUserId, (req, res) => {

  Users.remove(req.user.id)
        .then(removed => {
          res.status(200).json(req.user);
        })
        .catch(err => {
          res.status(500).json({error: "There was an issue removing the user."})
        })

});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  const { id } = req.params;

  Users.update(id, req.body)
    .then(updated => {
      Users.getById(id)
        .then(user => {
          const updatedUser = {
            id: id,
            name: req.body.name
          }
          res.status(200).json(updatedUser)
        })
        .catch(err => {
          res.status(404).json({message: "The user with the specified ID does not exist."})
        })
    })
    .catch(err => {
      res.status(500).json({error: "There was an issue while attempting to update."})
    })
});

function validateUser(req, res, next) {
  if(!req.body){
    res.status(400).json({message: "Missing user data."})
  }else if (!req.body.name){
    res.status(400).json({message: "Missing user name field."})
  }else{
    next();
  }
}

function validatePost(req, res, next) {
  const post = req.body;

  if(!post.text){
    res.status(400).json({message: "Missing required text field."})
  } else if (!req.body){
    res.status(400).json({message: "Missing post data."})
  } else {
    next();
  }
}

function validateUserId(req, res, next) {
  const { id } = req.params;
  
  Users.getById(id)
    .then(user => {
      if(user){
        req.user = user;
        next();
      } else {
        res.status(404).json({message: "User ID not found."})
      }
    })
    .catch(err => {
      res.status(400).json({message: "Invalid user ID."})
    })
}


module.exports = router;
