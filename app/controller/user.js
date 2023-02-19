const { Controller } = require('egg');

class UserController extends Controller {
  async create() {
    const body = this.ctx.request.body
    const userService = this.service.user
    // 1. 数据验证(验证失败状态码422)
    this.ctx.validate({
      userName: {
        type: 'string'
      },
      email: {
        type: 'email'
      },
      password: {
        type: 'string'
      }
    })
    // console.log('-----', this.service.user);
    if (await userService.findByuserName(body.userName)) {
      this.ctx.throw(422, '用户已存在')
    }
    if (await userService.findByEmail(body.email)) {
      this.ctx.throw(422, '邮箱已存在')
    }
    
    // 2. 保存用户
    const user = await userService.createUser(body)

    // 3. 生成token
    const token = userService.createToken({
      userId: user._id
    })
    // 4. 发送响应
    this.ctx.body = {
      user: {
        userName: user.userName,
        email: user.email,
        token,
        channelDescription: user.channelDescription,
        avatar: user.avatar
      }
    }
  }
}

module.exports = UserController;
