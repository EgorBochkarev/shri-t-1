const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SvgSpriteHtmlWebpackPlugin = require('svg-sprite-html-webpack');

module.exports = (env) => {
  const {mode = 'development'} = env || {};
  const isProd = mode === 'production';
  const isDev = mode === 'development';

  const getStyleLoader = () => {
    return [
      isProd ? MiniCssExtractPlugin.loader : 'style-loader',
      'css-loader'
    ];
  };

  const getPlugins = () => {
    const plugins = [
      new HtmlWebpackPlugin({
        title: 'Builder CI',
        template: 'pages/index.html',
        filename: 'index.html'
      }),
      new SvgSpriteHtmlWebpackPlugin({
        includeFiles: [
          'src/svg/*.svg',
        ],
        append: true
      })
    ];
    if (isProd) {
      plugins.push(
          new MiniCssExtractPlugin({
            filename: 'main-[hash:8].css'
          })
      );
    }
    return plugins;
  };
  return {
    mode: isProd ? 'production' : isDev && 'development',
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.(css)$/,
          exclude: /node_modules/,
          use: getStyleLoader()
        },
        {
          test: /\.(s[ca]ss)$/,
          exclude: /node_modules/,
          use: [...getStyleLoader(), 'sass-loader']
        },
        {
          test: /\.(png|jpeg|gif|ico)$/,
          use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'images',
              name: '[name]-[sha1:hash:7].[ext]'
            }
          }]
        },
        {
          test: /\.(ttf|otf|eot|woff|woff2)$/,
          use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'fonts',
              name: '[name].[ext]'
            }
          }]
        }
      ]
    },
    plugins: getPlugins(),
    output: {
      path: __dirname + '/dist',
      filename: 'main.js',
      publicPath: '/'
    },
    devServer: {
      open: true,
      historyApiFallback: true,
      proxy: [{
        path: '/api/',
        target: 'http://localhost:3000'
      }]
    }
  };
};
