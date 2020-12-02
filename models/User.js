const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: String,
  firstname: String,
  lastname: String,
  password: String,
  picture: String,
  email: String,
  createdAt: String
});

module.exports = model('User', userSchema);
