module.exports = () => { // 外层函数负责接收参数
  // 返回一个中间件处理函数
  return async function (ctx, next) {
    // 1. 获取请求头中的token数据
    let token = ctx.headers['authorization'] 
    token = token
      ?
      token.split('Bearer ')[1] // Bearer空格token数据
      :
      null
    // 2. 验证token，无效401
    if (!token) {
      ctx.throw(401)
    }
    // 3. token有效，根据userId获取用户数据挂载到ctx上面，给后续中间件使用
    try {
     const data = ctx.service.user.verifyToken(token)
     console.log('data', data);
     ctx.user = await ctx.model.User.findById(data.userId)
    //  userId
    } catch (error) {
      ctx.throw(401)
    }
    // 4. 后续操作
    await next()
  };
};