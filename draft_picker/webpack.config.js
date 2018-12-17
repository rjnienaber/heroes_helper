const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const webpack = require('webpack');

const gitRevisionPlugin = new GitRevisionPlugin();

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
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(gitRevisionPlugin.commithash().substring(0, 7)),
      BUILD_DATE: JSON.stringify(new Date())
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: 'index.html'
    }),
    new CopyWebpackPlugin([
      { from: 'node_modules/bootstrap/dist/css/bootstrap.min.css', to: 'bootstrap.4.1.3.min.css' },
      { from: 'node_modules/bootswatch/dist/united/bootstrap.min.css', to: 'bootswatch.4.1.3.min.css' },
      { from: 'node_modules/selectize/dist/css/selectize.bootstrap3.css', to: 'selectize.bootstrap3.0.12.6.css' },
      { from: 'vendor/gh-fork-ribbon.css', to: 'gh-fork-ribbon.0.2.2.css' },
      { from: 'vendor/modernizr.2.8.3.min.js', to: 'modernizr.2.8.3.min.js' },
      { from: 'node_modules/jquery/dist/jquery.min.js', to: 'jquery.3.3.1.min.js' },
      { from: 'node_modules/bootstrap/dist/js/bootstrap.min.js', to: 'bootstrap.4.1.3.min.js' },
      { from: 'node_modules/selectize/dist/js/standalone/selectize.min.js', to: 'selectize.0.12.6.min.js' }
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
         test: /\.jsx?$/,
         exclude: /node_modules/,
         use: [
           {
             loader: 'babel-loader',
             options: {
               presets: ['@babel/preset-react']
             }
           }
         ],
       }
     ]
   }
};
