const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SvgSpriteHtmlWebpackPlugin = require('svg-sprite-html-webpack');

module.exports = (env) => {
  return {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.(s[ca]ss)$/,
          exclude: /node_modules/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Test',
        template: 'pages/test.html',
        filename: 'test/index.html'
      }),
      new HtmlWebpackPlugin({
        title: 'Home',
        template: 'pages/start.html',
        filename: 'index.html'
      }),
      new HtmlWebpackPlugin({
        title: 'Details',
        template: 'pages/details.html',
        filename: 'details/index.html'
      }),
      new HtmlWebpackPlugin({
        title: 'History',
        template: 'pages/history.html',
        filename: 'history/index.html'
      }),
      new HtmlWebpackPlugin({
        title: 'Settings',
        template: 'pages/settings.html',
        filename: 'settings/index.html'
      }),
      new SvgSpriteHtmlWebpackPlugin({
        includeFiles: [
          'src/svg/*.svg',
        ],
        append: true
      }),
      new MiniCssExtractPlugin({
        filename: 'main.css'
      })
    ],
    devServer: {
      open: true
    }
  };
}