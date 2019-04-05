module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false
      }
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    captureTimeout: 210000,
    browserDisconnectTolerance: 3,
    browserDisconnectTimeout : 210000,
    browserNoActivityTimeout : 210000,
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    listenAddress: 'localhost',
    hostname: 'localhost',
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--headless',
          '--no-sandbox',
          '--password-store=basic',
          '--enable-logging',
          '--v=1'
        ],
      },
    },
    singleRun: true
  });
};
