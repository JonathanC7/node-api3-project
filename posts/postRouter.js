const express = require('express');

const Posts = require('./postDb.js');

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({error: "Could not retrieve data."})
    })
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Posts.getById(id)
    .then(post => {
      if(post){
        res.status(200).json(post);
      } else {
        res.status(404).json({error: "The post with the specified ID was not found."})
      }
    })
    .catch(err => {
      res.status(500).json({message: "There was an issue when attempting to retrieve post."})
    })
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  Posts.getById(id)
    .then(post => {
      res.status(200).json(post);
      Posts.remove(post.id)
        .then(response => {
        })
        .catch(err => {
          res.status(404).json({message: "The post with the specified ID does not exist."})
        })
    })
    .catch(err => {
      res.status(404).json({message: "The post with the specified ID does not exist."})
    })
});

router.put('/:id', validatePost, (req, res) => {
  const { id } = req.params;

  Posts.update(id, req.body)
    .then(post => {
      res.status(200).json(req.body);
    })
    .catch(err => {
      res.status(500).json({error: "Unable to replace post."})
    })
});

// custom middleware

function validatePost(req, res, next) {
  const post = req.body;

  if(!post.text){
    res.status(400).json({message: "Missing required text field."})
  } else if(!req.body){
    res.status(400).json({message: "Missing post data."})
  } else {
    next();
  }
}

module.exports = router;
