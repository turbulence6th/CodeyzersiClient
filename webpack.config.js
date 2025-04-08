const path = require('path');
const webpack = require('webpack');

// Ortam değişkenlerini kontrol et
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
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
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    // NODE_ENV değişkenini tanımla
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production')
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    proxy: isDevelopment ? {
      '/move': 'http://localhost:8080'
    } : {
      '/move': 'https://codeyzersiserver.tail9fb8f4.ts.net'
    }
  },
  // Development modunda source map ekle
  devtool: isDevelopment ? 'eval-source-map' : false,
  // Production modunda kodu optimize et
  mode: isDevelopment ? 'development' : 'production'
}; 