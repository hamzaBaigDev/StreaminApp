const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  authToken: { type: String },
  is_verified: { type: Boolean, default: false },
  created_date: { type: Date, default: Date.now },
  roles: { type: String, default: 'User' },
  Channel: { type: String, default: 'Web' },

});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('ReactUser', userSchema);