const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SvgSpriteHtmlWebpackPlugin = require('svg-sprite-html-webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

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
      new CleanWebpackPlugin(),
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
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          loader: ['awesome-typescript-loader']
        },
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
    entry: {
      main: './src/index.tsx',
      sw: './src/sw.js'
    },
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: ({chunk}) => {
        return chunk.name === 'sw' ? '[name].js': '[name]-[hash:8].js';
      }
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
