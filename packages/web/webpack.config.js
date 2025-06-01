const path = require('path');
const webpack = require('webpack');

// Load environment variables from top-level .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  entry: './static/js/index.js',
  output: {
    path: path.resolve(__dirname, 'static/js/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
    })
  ]
}; 