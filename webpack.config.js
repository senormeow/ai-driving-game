const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
    template: './src/index.html',
    filename: './index.html',
});

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // use: {
                //   loader: 'babel-loader',
                // },
            },
        ],
    },
    plugins: [htmlPlugin,
              new CopyPlugin([{ from: 'src/assets', to: 'assets' }])],
};
