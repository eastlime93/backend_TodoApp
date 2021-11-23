var express = require('express');
var router = express.Router();
const User = require('../models/User')
const Todo = require('../models/Todo')

router.get('/', async function(req, res, next) {
  const users = await User.find().exec();
  return res.status(200).json(users);
});

router.get('/:userId', async function(req,res,next){
  const todos = await Todo.find().where('user_id').equals(req.params.userId).exec();
  return res.status(200).json({todos});
})

module.exports = router;
