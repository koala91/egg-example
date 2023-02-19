const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log('this.app.model', this.app.model);
    const User = this.app.model.User
    await new User({
      userName: 'test123',
      password: '123456test'
    }).save()
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
