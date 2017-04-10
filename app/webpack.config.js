const path              = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const cssModules        = 'modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]'

const config = {
  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  entry: {
    app: ['./src/index.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loaders: ['babel'] },
      { test: /\.css$/, exclude: /node_modules/, loader: `style-loader!css-loader?${cssModules}` }
    ]
  },

  devServer: {
    host: '0.0.0.0',
    port: process.env.PORT,
    inline: true
  },

  plugins: [
    new HtmlWebpackPlugin({ template: './src/assets/index.html' }),
    new ExtractTextPlugin('style.css', { allChunks: true })
  ]
}

module.exports = config
