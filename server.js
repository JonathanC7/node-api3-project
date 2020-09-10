const express = require('express');
const postsRouter = require('./posts/postRouter.js');
const usersRouter = require('./users/userRouter.js');

const server = express();

server.use(express.json());
server.use(logger);
server.use('/api/posts', postsRouter);
server.use('/api/users', usersRouter);

//custom middleware

function logger(req, res, next) {
  const log = {
    method: req.method,
    url: req.url,
    time: Date()
  }
  console.log(log)
  next();
}


module.exports = server;
