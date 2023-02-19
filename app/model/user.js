module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    userName: { 
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: { 
      type: String,
      select: false,
      required: true
    },
    avatar: {
      type: String,
      default: null
    },
    cover: {
      type: String,
      default: null
    },
    channelDescription: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });

  return mongoose.model('User', UserSchema);
}