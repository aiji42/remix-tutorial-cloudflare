const path = require('path')
const webpack = require('webpack')

const mode = process.env.NODE_ENV || 'production'

module.exports = {
  entry: path.resolve(__dirname, 'worker/index.js'),
  output: {
    filename: `worker.js`,
    path: path.join(__dirname, 'dist')
  },
  mode,
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: []
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      }
    ]
  },
  externals: [
    {
      'cross-fetch': 'fetch'
    }
  ]
}
