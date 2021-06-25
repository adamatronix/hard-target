const path = require('path')

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'lib')
  },
  module: {
    rules: [  
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        }, 
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
            }
        },
        {
          test: /\.scss$/,
          use: [{
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'sass-loader'
          }]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        },
        {
          test: /\.(obj|fbx)$/,
          loader: 'url-loader'
        }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}