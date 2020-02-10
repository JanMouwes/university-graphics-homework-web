const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');

const output = path.join(ROOT, './dist');
const entryPath = path.join(SRC, 'index.js');

module.exports = {
    target: 'node',
    entry: entryPath,
    output: {
        path: output,
        filename: 'index.js'
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(jsx?|tsx?)$/,
                use: ['babel-loader'],
                exclude: path.resolve(ROOT, 'node_modules')
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    }
};
