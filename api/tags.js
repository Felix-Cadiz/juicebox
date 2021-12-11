const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName, client } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();
  res.send({
    tags
  });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  console.log(req.params)
  const tagName = decodeURIComponent(req.params.tagName)
  console.log(tagName)
  try {
    const selectedPosts = await getPostsByTagName(tagName)
    const filteredPosts = selectedPosts.filter(post => {
      return post.active || (req.user && post.author.id === req.user.id);
    });
    if (filteredPosts) {
      res.send({
        filteredPosts
      })
    } else {
      next ({
        name: 'PostsNotFound',
        message: 'Posts cannot be found'
      })
    }
  } catch ({ name, message }) {
    next({name, message});
  }
});

module.exports = tagsRouter;