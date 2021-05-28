// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
// https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        client: {
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
        },
        coverageReporter: {
            dir: 'coverage',
            subdir: 'random-team-generator',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ],
            fixWebpackSourcePaths: true,
            check: {
                global: {
                    statements: 100,
                    lines: 100,
                    branches: 100,
                    functions: 100,
                },
                each: {
                    statements: 100,
                    lines: 100,
                    branches: 100,
                    functions: 100,
                },
            },
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        restartOnFileChange: true,
    });
};
