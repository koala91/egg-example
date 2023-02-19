/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1676812205408_417';

  // add your middleware config here
  config.middleware = [
    'errorHandle'
  ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.mongoose = {
    url: 'mongodb://127.0.0.1/youtube-clone',
    options: {
      useUnifiedTopology: true
    },
    // mongoose global plugins, expected a function or an array of function and options
    // plugins: [createdPlugin, [updatedPlugin, pluginOptions]],
  };

  config.security = {
    csrf: {
      enable: false
    }
  }

  config.jwt = {
    secret: '3e294b26-d7c1-4f8a-a09d-be4ce293b892',
    expiresIn: '1d'
  }


  return {
    ...config,
    ...userConfig,
  };
};
