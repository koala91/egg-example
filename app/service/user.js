const { Service } = require('egg');
const jwt = require('jsonwebtoken')
console.log('22222');

class UserService extends Service {
  get User () {
    return this.app.model.User
  }
  findByuserName (userName) {
    return this.User.findOne({
      userName
    })
  }

  findByEmail (email) {
    return this.User.findOne({
      email
    })
  }

  async createUser (data) {
    data.password = this.ctx.helper.md5(data.password)

    const user = new this.User(data)
    await user.save()
    return user
  }

  createToken (data) {
    return jwt.sign(data, this.app.config.jwt.secret, {
      expiresIn: this.app.config.jwt.expiresIn
    })
  }

  verifyToken (token) {
    return jwt.verify(token, this.app.config.jwt.secret)
  }

  updateuser (data) {
    return this.User.findByIdAndUpdate(this.ctx.user._id, data, {
      new: true // 返回更新之后的数据
    })
  }
}

module.exports = UserService