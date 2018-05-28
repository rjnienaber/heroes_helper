const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    stylesheets: './src/ui/css/stylesheets.js',
    app: './src/index.js'
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      inject: false,
      template: 'index.html'
    }),
    new CopyWebpackPlugin([
      { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'bootstrap.3.3.7.min.css' },
      { from: 'node_modules/bootswatch/united/bootstrap.min.css', to: 'bootswatch.3.3.7.min.css' },
      { from: 'node_modules/selectize/dist/css/selectize.bootstrap3.css', to: 'selectize.bootstrap3.0.12.4.css' },
      { from: 'vendor/gh-fork-ribbon.css', to: 'gh-fork-ribbon.0.2.2.css' },
      { from: 'vendor/modernizr.2.8.3.min.js', to: 'modernizr.2.8.3.min.js' },
      { from: 'node_modules/jquery/dist/jquery.min.js', to: 'jquery.3.3.1.min.js' },
      { from: 'node_modules/bootstrap/dist/js/bootstrap.min.js', to: 'bootstrap.3.3.7.min.js' },
      { from: 'node_modules/selectize/dist/js/standalone/selectize.min.js', to: 'selectize.0.12.4.min.js' }
    ])
  ],
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
   module: {
     rules: [
       {
         test: /\.css$/,
         use: [
           'style-loader',
           'css-loader'
         ]
       },
       {
         test: /\.(png|svg|jpg|gif|ttf|woff|woff2|eot)$/,
         use: [
           'file-loader'
         ]
       },
       {
         test: /\.js$/,
         exclude: /node_modules/,
         loader: 'babel-loader'
       }
     ]
   }
};