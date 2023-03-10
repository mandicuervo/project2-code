const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;
const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        match: EMAIL_PATTERN,
        required: [true, 'Email is required'],
        unique: [true, 'Email is already in use'],
    },
    username: {
      type: String,
      required: [true, 'User name is required'],
      unique: [true, 'User name is already in use'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Your password must have at least 8 characters']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required']
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required']
    },
    height: {
        type: Number,
        required: [true, 'Height is required']
    },
    bday: {
        type: Date,
        required: [true, 'Date of Birth is required']
    },
    activity: {
        type: String,
        required: [true, 'Activity level is required'],
        enum: ["sedentary", "low-active", "active", "very-active"]

    },
    dietGoal: {
        type: String,
        required: [true, 'Diet goal is required']
    },
    goalWeight: {
        type: Number,
        required: [true, 'Goal Weight is required']
        
    },
},
{
    timestamps: true,
}
);

userSchema.pre('save', function(next) {
  const rawPassword = this.password;
  if (this.isModified('password')) {
    bcrypt.hash(rawPassword, SALT_ROUNDS)
      .then(hash => {
        this.password = hash;
        next()
      })
      .catch(err => next(err))
  } else {
    next();
  }
})

userSchema.methods.checkPassword = function(passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;