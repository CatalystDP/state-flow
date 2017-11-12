const path = require('path');
const webpack=require('webpack');
module.exports = {
  entry: path.join(__dirname,'test','src', 'index'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'test/dist')
  },
  watch:true,
  plugins:[
      new webpack.ProvidePlugin({
        'window.React':'react',
        'window.ReactDOM':'react-dom'
      })
  ],
  devtool:'inline-sourcemap',
  module: {
    rules:[
      {
        test:/\.js$/,
        exclude:/(node_modules)/,
        use:{
          loader:'babel-loader',
          options:{
            presets:['env','react']
          }
        }
      }
    ]
  }
};