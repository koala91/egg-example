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
  async getCurrent () {
    // 验证token
    // 获取用户
    // 发送响应
    const user = this.ctx.user
    this.ctx.body = {
      user: {
        userName: user.userName,
        email: user.email,
        token: this.ctx.headers['authorization'],
        channelDescription: user.channelDescription,
        avatar: user.avatar
      }
    }
  }
  async update () {
    // 1. 基本数据验证
    const body = this.ctx.request.body
    const userService = this.service.user
    // 1. 数据验证(验证失败状态码422)
    this.ctx.validate({
      userName: { type: 'string', required: false},
      email: { type: 'email', required: false},
      password: { type: 'string', required: false},
      channelDescription: { type: 'string', required: false },
      avatar: { type: 'string', required: false }
    }, body)
    // 2. 检验用户是否已存在
    if (body.email) {
      if (body.email !== this.ctx.user.email && await userService.findByEmail(body.email)) {
        this.ctx.throw(422, 'email 已存在')
      }
    }
    if (body.userName) {
      if (body.userName !== this.ctx.user.userName && await userService.findByuserName(body.userName)) {
        this.ctx.throw(422, 'userName 已存在')
      }
    }
    if (body.password) {
      body.password = this.ctx.helper.md5(body.password)
    }
    // 3. 更新用户信息
    const user = await userService.updateuser(body)
    // 4. 返回更新后的用户信息
    this.ctx.body = {
      user: {
        email: user.email,
        userName: user.userName,
        password: user.password,
        channelDescription: user.channelDescription,
        avatar: user.avatar
      }
    }
  }
}

module.exports = UserController;
