module.exports = config => {
    config.set({
        frameworks: ['jasmine'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: [
            'Chrome'
        ],
        browserNoActivityTimeout: 60000,
  });
};
