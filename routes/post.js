/** @format */

const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

// create post
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json(error);
  }
});
// update post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      return res.status(200).json('Post updated');
    } else {
      res.status(403).json('You can update only your post');
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});
// delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // console.log(post.userId + ' And ' + req.params.userId);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json('Post deleted');
    } else {
      res.status(403).json('You can delete only your post');
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});
// get a post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json(error);
  }
});
// get timeline post
router.get('/timeline/all', async (req, res) => {
  //   let postArr = [];
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    // console.log(friendPosts);
    return res.json(userPosts.concat(...friendPosts));
  } catch (error) {
    return res.status(500).json(error);
  }
});
// like post
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json('You liked this post');
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      return res.status(200).json('You unliked this post');
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get('/', (req, res) => {
  res.send('hello Post');
});

module.exports = router;
