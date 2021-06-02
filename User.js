
// defing required variables 
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const saltRounds = 10


// New Schema for storing the new User
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})


// To save the details of new users.
// password will be stored as a hashed value.
UserSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('password')) {
    const document = this
    bcrypt.hash(this.password, saltRounds, function (err, hashedPassword) {
      if (err) {
        next(err)
      } else {
        document.password = hashedPassword
        next()
      }
    })
  } else {
    next()
  }
})


// For checking the entered password is correct or not
UserSchema.methods.isCorrectPassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, same) {
    console.log(err)
    if (err) {
      callback(err)
    } else {
      callback(err, same)
    }
  })
}

module.exports = mongoose.model('User', UserSchema)
