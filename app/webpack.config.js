const path              = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const cssModules        = 'modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]'

const config = {
  resolve: {
    extensions: ['.js', '.jsx']
  },

  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  module: {
    rules: [
      { test: /\.(jsx?)$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, exclude: /node_modules/, loader: `style-loader!css-loader?${cssModules}` }
    ]
  },

  devServer: {
    host: '0.0.0.0',
    port: process.env.PORT,
    inline: true
  },

  plugins: [
    new HtmlWebpackPlugin({ template: './src/assets/index.html', filename: 'index.html', inject: 'body' }),
    new ExtractTextPlugin({ filename: 'style.css', disable: false, allChunks: true })
  ]
}

module.exports = config
