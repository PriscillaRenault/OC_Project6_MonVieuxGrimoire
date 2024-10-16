const mongoose = require('mongoose')
//S'assure qu'un utilisateur ne peut pas s'inscrire plusieurs fois avec la même adresse e-mail
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)
