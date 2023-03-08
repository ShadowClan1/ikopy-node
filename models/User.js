const mongoose = require('mongoose');


const { Schema } = mongoose;

const userSchema = new Schema({
  name:{
    type: String,
    required: true

  }, 
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    deafault: Date.now
  }
});

const User =  mongoose.model('user', userSchema);
User.createIndexes();
module.exports = User;