const asyncHandler = require('express-async-handler');
const blogMiddleware = require('../middleware/blog');

module.exports = {
  getAllPost: asyncHandler(async (req, res) => {
    const { limit, offset, search } = req.query;
    const results = await blogMiddleware.getAllPost(limit, offset, search);
    res.json(results);
  }),

  getPostById: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const results = await blogMiddleware.getPostById(postId);
    res.json(results);
  }),

  addNewPostData: asyncHandler(async (req, res) => {
    const { title, desc, image } = req.body;
    const results = await blogMiddleware.addNewPostData({ title, desc, image });
    res.json(results);
  }),

  deletePostData: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const results = await blogMiddleware.deletePostData(postId);
    res.json(results);
  }),

  updatePostData: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { title, desc, image } = req.body;
    const results = await blogMiddleware.updatePostData(
      postId,
      title,
      desc,
      image
    );
    res.json(results);
  }),
};

