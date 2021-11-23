var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const Todo = require('../models/Todo')
const User = require('../models/User')

const privateKey = process.env.JWT_PRIVATE_KEY;

router.get('/:todoId',async function(req, res, next){
  const todo = await Todo.findOne().where('_id').equals(req.params.todoId).exec();
  return res.status(200).json(todo)
})

router.use(function(req,res,next){
  if(req.header("Authorization")){
    try{
      req.payload = jwt.verify(req.header("Authorization"), privateKey, {algorithms: ['RS256']})
    }catch(error){
      return res.status(401).json({"error":error.message});
    }
  }else{
    return res.status(401).json({"error": "Unauthorized"});
  }
  next();
})

router.get('/', async function(req, res, next) {
   const todos = await Todo.find().where('user_id').equals(req.payload.id).exec();
   return res.status(200).json({"todos": todos});
 })

 router.post('/', function(req, res,next){
   const todo = new Todo({
     "title": req.body.title,
     "description": req.body.description,
     "dateCreated": req.body.dateCreated,
     "complete": req.body.complete,
     "dateCompleted": req.body.dateCompleted,
     "user": req.body.user,
     "user_id": req.payload.id
   })

   todo.save().then(savedTodo => {
     return res.status(201).json(savedTodo)
   }).catch(error => {
     return res.status(500).json({"error": error.message})
   })
 });

router.patch('/:todoId',async function(req, res, next){
  const todo = await Todo.findOne().where('_id').equals(req.params.todoId).exec();
  if(todo.user_id.equals(req.payload.id)){
    const targetTodo = await Todo.findOneAndUpdate({'_id': req.params.todoId}, {"complete":req.body.complete, "dateCompleted":req.body.dateCompleted}, {"new": true}).exec();
    return res.status(200).json(targetTodo)
  }else{
    return res.status(401).json({"error": "Unauthorized"})
  }
})

router.delete('/:todoId',async function(req, res, next){
  const todo = await Todo.findOne().where('_id').equals(req.params.todoId).exec();
  if(todo.user_id.equals(req.payload.id)){
    todo.delete().then(deletedTodo =>{
      return res.status(200).json(deletedTodo)
    }).catch(error => {
      return res.status(500).json({"error": error.message})
    })
  }else{
    return res.status(401).json({"error": "Unauthorized"})
  }
})

module.exports = router;
