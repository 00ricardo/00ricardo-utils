const path = require('path');

module.exports = {
    mode: 'production',
    entry: './index.js', // path to the entry file of your library
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '00ricardo-utils.min.js',
        library: '00ricardo-utils',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    optimization: {
        minimize: true
    }
};
