const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
    return {
        mode:  "development",
        module: {
            rules: [
                {
                    test: /\.(s[ca]ss)$/,
                    exclude: /node_modules/,
                    use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ] 
                }
            ]
        },
        plugins: [
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
            new MiniCssExtractPlugin({
                filename: 'main.css'
            })
        ],
        devServer: {
            open: true 
        }
    }
}