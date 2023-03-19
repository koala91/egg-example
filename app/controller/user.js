const { Controller } = require('egg');

class UserController extends Controller {
  async create() {
    //  注册的用户数据格式
    // {
    //     "userName": "test1",
    //     "email": "test1@qq.com",
    //     "password": "123456456"
    // }
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
  async login () {
    //   登录用户数据格式
    // {
    //     "email": "test1@qq.com",
    //     "password": "123456456"
    // }
    const body = this.ctx.request.body
    // 1. 基本的数据验证
    this.ctx.validate({
      email: {
        type: 'email'
      },
      password: {
        type: 'string'
      }
    })
    // 2. 验证邮箱是否存在
    const userService = this.service.user
    const user = await userService.findByEmail(body.email).select('+password')
    if (!user) {
      this.ctx.throw(422, '用户不存在')
    }
    // 3. 验证密码是否正确
    if (this.ctx.helper.md5(body.password) !== user.password) {
      this.ctx.throw(422, '密码不正确')
    }
    // 4. 生成token
    const token = userService.createToken({
      userId: user._id
    })
    // 5. 发送响应数据
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
