const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TodoSchema = new Schema(
  {
    title: {type:String, required:true},
    description: {type:String},
    dateCreated:{type:String, required:true},
    complete:{type:Boolean},
    dateCompleted:{type:String},
    user:{type:String, required:true},
    user_id: {type:Schema.Types.ObjectId, ref:'User'}
  }
)

module.exports = mongoose.model('Todo', TodoSchema);
