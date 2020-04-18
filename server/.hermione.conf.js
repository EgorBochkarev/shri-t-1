module.exports = {
    baseUrl: 'http://localhost:3000',

    browsers: {
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome'
            }
        },
        mobile_chrome: {
            desiredCapabilities: {
                browserName: 'chrome'
            },
            windowSize: "480x800"
        }
    },
    plugins: {
        'html-reporter/hermione': {
            path: 'hermione-html-report'
        }
    }
};
 