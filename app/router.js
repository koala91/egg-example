'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router.get('/', controller.home.index);

  router.prefix('/api/v1') // 设置基础路径

  router.post('/users', controller.user.create)
};
