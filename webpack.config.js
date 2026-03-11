const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
var path = require("path");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html",
});

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    htmlPlugin,
    new CopyPlugin({
      patterns: [{ from: "images", to: "assets" }],
    }),
  ],
  output: {
    path: path.resolve(__dirname, "./assets"),
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "./assets"),
    },
  },
  resolve: {
    fallback: {
      util: false,
      os: false,
      path: false,
      child_process: false,
      fs: false,
    },
  },
};
