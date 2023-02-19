module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const subscriptionSchema = new Schema({
    user: { // 订阅用户
      type: mongoose.ObjectId,
      ref: "User",
      required: true
    },
    channel: { //订阅频道（用户本身就是频道）
      type: mongoose.ObjectId,
      ref: 'User',
      required: true
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

  return mongoose.model('Subscription', subscriptionSchema);
}